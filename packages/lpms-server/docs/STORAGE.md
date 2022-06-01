# Storage

Provides an overview as to how the `leveldb` database is structured within `lpms-server`.

## Encoding

All fields, except simple arrays of a primitives (ie. `number`, `number[]` etc), should be encapsulated within a `protobuf` message and have this used as a means of encoding to / from the `leveldb` database. All dates are to be in ISO-8601 (ie. YYYY-MM-DD).

## Requirements

Related: [story: AP reservation overview](https://github.com/windingtree/win-stays/issues/17)

Identify what *queries* must be able to be answered from the database:

1. How to get information relating to a booking?
2. How to get what bookings are staying at an accommodation facility on a specific day?
3. How to get all bookings for a `space` on a given day?
4. How to find the number of `space` type that are booked on a given day?
5. Given a day, determine if a `space` type is available to be booked.
6. Given a date range, determine if a `space` type is available to be booked.
7. Look up any personal information held for a specific stub (booking).

## leveldb

Key: `facilities`
Value: `string[]`
Description: A list of facilities that are handled by this `lpms-server`.

## sublevels

### facilities

Parent level: *root*
Level: `facilityId` (dynamic)

Key: `metadata`
Value: `videre.stays.facility.Facility`
Description: The metadata at a facility level.

Key: `stubs`
Value: `string[]`
Description: A list of all `stubId`s issued by this facility.

Key: `spaces`
Value: `string[]`
Description: A list of `spaceId`s that belong to this facility

Key: `otherItems`
Value: `string[]`
Description: A list of other `itemId`s that are offered by this facility

#### rules

Parent level: `facilityId` (dynamic)
Level: `rules`
Description: contains all the rules that will be applied by this facility

Key: `notice_required`
Value: `videre.stays.lpms.NoticeRequiredRule`
Description: The number of days notice that is required to book at this facility.

Key: `length_of_stay`
Value: `videre.stays.lpms.DayOfWeekLOSRule`
Description: An object containing day of week overrides. Refer to protobuf.

##### modifiers

Parent level: `facilityId` (dynamic)
Level: `modifiers`
Description: Logic that is used to recalculate the base rate

Key: `day_of_week`
Value: `videre.stays.lpms.DayOfWeekRateModifer`
Description: An object containing rate modifiers for days of the week (may be null)

Key: `occupancy`
Value: `videre.stays.lpms.OccupancyRateModifier`
Description: An object containing the per-occupant modifications to rates greater

Key: `length_of_stay`
Value: `videre.stays.lpms.LOSRateModifier`
Description: An object containing a length-of-stay rate modifier

#### stubs

Parent level: `facilityId` (dynamic)
Level: `stubs`
Description: Contains all the bookings (`stubs`) issued by this facility.

Key: `stubId` (dynamic)
Value: videre.stays.lpms.StubStorage
Description: Contains all the data for the `stub` (booking). The EIP-712 hash of this `stub` should be equal to the `EIP-712` hash of the `stub` at `stubId` when looked up on chain.
Notes: This meets the requirement (1) and (7)

Key: `YYYY-MM-DD` (dynamic)
Value: `string[]`
Description: Contains a list of all stubs (bookings) that are on the specified date.
Notes: This meets the requirement (2)

#### spaces

Parent level: `facilityId` (dynamic)
Level: `spaceId` (dynamic)

Key: `metadata_generic`
Value: `videre.stays.lpms.facility.Item`
Description: Contains generic data for each item (name, photos etc)

Key: `metadata`
Value: `videre.stays.lpms.facility.Space`
Description: Contains specific metadata for Spaces (views, sleeping arrangements etc).

##### rates

Parent level: `facilityId.spaceId` (dynamic)
Level: `rates`

Key: `default`
Value: `videre.stays.lpms.Rates`
Description: Contains the `Rates` message protobuf describing the rate for this space.

Key: `YYYY-MM-DD` (dynamic)
Value: `videre.stays.lpms.Rates`
Description: Contains the `Rates` message protobuf for a per-day override of rates.

##### availability

Parent level: `facilityId.spaceId` (dynamic)
Level: `availability`

Key: `default`
Value: `videre.stays.lpms.Availability`
Description: Contains the `Availability` message protobuf describing the number of spaces available.

Key: `YYYY-MM-DD` (dynamic)
Value: `videre.stays.lpms.Availability`
Description: Contains the daily override for `Availability`.

##### rules

Parent level: `facilityId.spaceId` (dynamic)
Level: `rules`

Key: `notice_required`
Value: `videre.stays.lpms.NoticeRequiredRule`
Description: The number of days notice that is required to book `spaceId`.

Key: `length_of_stay`
Value: `videre.stays.lpms.DayOfWeekLOSRule`
Description: An object containing day of week overrides. Refer to protobuf.

##### modifiers

Parent level: `facilityId.spaceId` (dynamic)
Level: `modifiers`
Description: Logic that is used to recalculate the base rate

Key: `day_of_week`
Value: `videre.stays.lpms.DayOfWeekRateModifer`
Description: An object containing rate modifiers for days of the week (may be null)

Key: `occupancy`
Value: `videre.stays.lpms.OccupancyRateModifier`
Description: An object containing the per-occupant modifications to rates greater

Key: `length_of_stay`
Value: `videre.stays.lpms.LOSRateModifier`
Description: An object containing a length-of-stay rate modifier

##### stubs

Parent level: `facilityId.spaceId` (dynamic)
Level: `stubs`

Key: `YYYY-MM-DD` (dynamic)
Value: `string[]`
Description: Contains a list of all stubs, ie. `stubId` (bookings) that are on the  date YYYY-MM-DD in this `spaceId`.
Notes: This meets the requirement (3)

Key: `YYYY-MM-DD-num_booked` (dynamic)
Value: `number`
Description: Contains the number of this specific type of `space` booked for the specific day. This is required as a booking may contain multiple spaces (rooms), therefore a sum(YYYY-MM-DD) will not suffice and this must be accounted for separately. Maintaining this counter avoids `O(n)` lookup complexity when summing `numSpacesReq` across bookings.
Notes: This meets the requirement (4)

#### otherItems

Parent level: `facilityId` (dynamic)
Level: `otherItems`

Key: `itemId` (dynamic)
Value: `videre.stays.lpms.facility.Item`
Description: Contains generic data for the item (name, photos, etc)

# CRUD

## Stubs (booking)

### Create

1. Add to `facilityId.stubs.stubId` the booking data.
2. Add `stubId` to `facilityId.stubs.YYYY-MMM-DD` indices (ie. `Array.push`)
3. Add `stubId` to `facilityId.spaceId.stubs.YYYY-MM-DD` indices (ie. `Array.push`)
4. Increment `facilityId.spaceId.stubs.YYYY-MM-DD-num_booked` by the `numSpacesReq`.

### Read

1. Get a booking's information: `facilityId.stub.stubId`
2. Find all bookings on a date: `facilityId.stubs.YYYY-MM-DD` index
3. Find all bookings by space id on a date: `facilityId.spaceId.stubs.YYYY-MM-DD` index.
4. Find number of spaces (rooms) booked by date: `facilityId.spaceId.stubs.YYYY-MM-DD-num_booked`.
5. Determine if a space can be booked on a given day:

    With daily availability override:

    `Ask.numSpacesReq <= (facilityId.spaceId.availability.YYYY-MM-DD - facilityId.spaceId.YYYY-MM-DD-num_booked)`

    With no daily availability override:

    `Ask.numSpacesReq <= (facilityId.spaceId.availability.default - facilityId.spaceId.YYYY-MM-DD-num_booked)`

    This meets the requirement of (5)
6. Determine if a space can be booked for a date range:

    ```python
        for day in date_range:
            # isAvailable = logic from (5) above
            if (!isAvailable)
                return false
        return true
    ```
    This meets the requirement of (6)

### Update

**TODO**

### Delete

**TODO**

# Metadata

In order to generate the final `metadata` binary glob that is uploaded to `IPFS`:

```typescript

let items: ServiceItemData[]

// process all spaces
const spaces = db.get('facilityId.spaces') // insert correct leveldb query here
for (const space of object) {
    // get generic metadata
    const generic = db.get(`${facilityId}.${space}.metadata_generic`) as Item
    const specific = db.get(`${facilityId}.${space}.metadata`) as Space
    generic.payload = Space.toBinary(specific)

    items.push({
        item: utils.arrayify(utils.formatBytes32String(space)),
        payload: Item.toBinary(generic)
    })
}

// process all other items
const otherItems = db.get('facilityId.otherItems') as Item[]
for (const item of otherItems) {
    const otherItem = db.get(`${facilityId}.otherItems.${item}`) as Item
    items.push({
        item: utils.arrayify(utils.formatBytes32String(item)),
        payload: Item.toBinary(otherItem)
    })
}

// assemble the metadata for signing / publishing
const serviceProviderData: ServiceProviderData = {
    serviceProvider: utils.arrayify(utils.formatBytes32String('provider')),
    payload: Facility.toBinary(db.get(`$facilityId.metadata`)),
    items: items,
    terms: []
}
```

# Todo

1. How to handle garbage collection
