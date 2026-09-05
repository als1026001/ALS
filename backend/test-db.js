const pool = require('./config/database');

async function testDatabase() {
    try {
        const result = await pool.query('SELECT NOW()');

        console.log('✅ Kết nối PostgreSQL thành công!');
        console.log('Thời gian database:', result.rows[0]);
    } catch (error) {
        console.error('❌ Kết nối PostgreSQL thất bại!');
        console.error(error.message);
    } finally {
        await pool.end();
    }
}

testDatabase();
