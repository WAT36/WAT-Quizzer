import { PrismaClient } from '@prisma/client';
import schema from './prisma/schema.prisma';
import x from './node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node';

if (process.env.NODE_ENV !== 'production') {
    console.debug(schema, x);
}
const prisma = new PrismaClient();
export default prisma;
