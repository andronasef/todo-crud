import { PGURL } from '$env/static/private';
import postgres from 'postgres';

const sql = postgres(PGURL);

export default sql;
