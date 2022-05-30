Facilities

```typescript
  [
    facilityId,
    facilityId2
  ]
```

DB Facilities info

```typescript
  {
    facilityId: {
        //facility data
      spaces: [
          //spaces
      ]
    }
    facilityId2: {
      //facility data
      spaces: [
        //spaces
      ]
    }
  }
```

DB Available Space

```typescript
  {
    hash('facilityId + spaceId'): {
      '01.06.2022': { //unavailable if date exist
          price: 100,
          bookingId: 'some id'
      },
      '02.06.2022': {
        price: 100,
        bookingId: 'some id'
      },
      '03.06.2022': {
        price: 90,
        bookingId: 'some id'
      },
      '04.06.2022': {
        price: 150,
        bookingId: 'some id'
      }
    }
  }
```

DB Bookings

```typescript
  {
    hash('facilityId + spaceId + bookingId'): {
      dates: [
          '01.06.2022',
          '02.06.2022',
          '03.06.2022',
          '04.06.2022',
        ];
      //some additional info
    }
  }
```

//todo Think about moving past events to the journal in order not to clog the databases
