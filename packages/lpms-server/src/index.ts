import ServerService from './services/ServerService';
import { port } from './config';

new ServerService(port).start();
