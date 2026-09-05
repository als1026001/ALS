const pool = require('../config/database');

const getMenus = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                menu_id,
                tenant_id,
                company_id,
                public_id,
                menu_no,
                menu_name,
                parent_menu_id,
                seq_no,
                menu_type_id,
                icon,
                router_link,
                menu_url,
                is_inactive,
                is_visible,
                is_security,
                is_external,
                target,
                permission_code,
                note
            FROM public.smenu
            WHERE is_inactive = false
              AND is_visible = true
            ORDER BY
                COALESCE(parent_menu_id, 0),
                seq_no,
                menu_id
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi lấy menu:', error);

        res.status(500).json({
            message: 'Không thể lấy danh sách menu',
            error: error.message
        });
    }
};

module.exports = {
    getMenus
};
