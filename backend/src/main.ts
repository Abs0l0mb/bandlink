'use strict';

import 'module-alias/register';

import { BackendServer } from '@src/classes';

new BackendServer(parseInt(process.argv[2]));