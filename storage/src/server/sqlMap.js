// sqlmap.js
var sqlMap = {
  query: {
    // 登录校验
    login: `SELECT * from user where username=? and password=?`,
    // 获取客户信息
    getCustomer: `select * from customer_info`,
    // 获取客户信息id
    getCustomerId: `select customer_id from customer_info where customer_id = ?`,
    // 依据客户信息的id号或者公司名称模糊查询
    getLocateCustomerId: `select customer_id from customer_info where LOCATE (?,customer_id) > 0`,
    getLocateCompanyName: `select company_name from customer_info where LOCATE (?,company_name) > 0`,
    // 依据客户id或者所属公司获取货物信息
    getProductByCustomerId: `SELECT * FROM product where LOCATE (?,customer_id) > 0`,
    getProductByCompanyName: `SELECT * FROM product p,customer_info c  where p.customer_id=c.customer_id and LOCATE (?,c.company_name) > 0`,
    // 获取所有货品信息
    getAllProduct: `SELECT * FROM product`,
    // 依据客户id或者所属公司获取 箱子 信息
    getBoxByCustomerId: `SELECT * FROM box where LOCATE (?,customer_id) > 0`,
    getBoxByCompanyName: `SELECT * FROM box b,customer_info c  where b.customer_id=c.customer_id and LOCATE (?,c.company_name) > 0`,
    // 获取所有 箱子 信息
    getAllBox: `SELECT * FROM box`,
    // 依据客户id或者所属公司获取客户 剩余金额 信息
    // 依据客户id或者所属公司获取客户 剩余金额 信息
    getLeaveAmountByCustomerId: `SELECT customer_id,leave_amount from customer_info where LOCATE (?,customer_id) > 0`,
    getLeaveAmountByCompanyName: `SELECT customer_id,leave_amount from customer_info where LOCATE (?,company_name) > 0`,
    // 依据客户id或者所属公司获取客户 充值记录 信息
    getRechargeByCustomerId: `SELECT recharge_date,recharge_amount,real_amount from recharge_record where LOCATE (?,customer_id) > 0`,
    getRechargeByCompanyName: `SELECT recharge_date,recharge_amount,real_amount from recharge_record,customer_info c where LOCATE (?,c.company_name) > 0`,
    // 依据客户id或者所属公司获取客户 交易记录 信息
    getTradingByCustomerId: `SELECT customer_id,trading_date,trading_amount,trading_content,status,trading_code from trading_record where LOCATE (?,customer_id) > 0`,
    getTradingByCompanyName: `SELECT  customer_id,trading_date,trading_amount,trading_content,status,trading_code from trading_record,customer_info c where LOCATE (?,c.company_name) > 0`,
    // 获取所有 交易 信息
    getAllTrading: `SELECT * FROM trading_record`,
    // 查询是否有相同sku
    getSameSku: `Select * From product where customer_id = ? and product_name = ? and product_sku = ?`,
    // 依据客户id或者所属公司获取 出库记录 信息
    getOutRecordByCustomerId: `SELECT * FROM out_record where LOCATE (?,customer_id) > 0`,
    getOutRecordByCompanyName: `SELECT * FROM out_record o,customer_info c  where o.customer_id=c.customer_id and LOCATE (?,c.company_name) > 0`,
    // 获取所有 出库记录 信息
    getAllOutRecord: `SELECT * FROM out_record`,
  },
  insert: {
    insertCustomer: `INSERT INTO customer_info VALUES(?,?,?,?)`,
    insertProduct: `INSERT INTO product VALUES(?,?,?,?,?,?,?,?,?,?)`,
    insertTrading: `INSERT INTO trading_record VALUES(?,?,?,?,?,?)`,
    insertBox: `INSERT INTO box VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`,
    insertOutRecord: `INSERT INTO out_record VALUES(?,?,?,?,?)`,
  },
  delete: {
    deleteCustomer: `delete from customer_info where customer_id IN (?) `,
    deleteTrading: `delete from trading_record 
    where customer_id=?
    and trading_code=?`,
    deleteProduct: `delete from product where customer_id=? and product_code=?`,
    deleteBox: `delete from box where customer_id=? and box_code=?`,
    deleteOutRecord: `delete from out_record where customer_id=? and product_name=? and product_sku= ? and out_time= ? and out_count=?`,
  },
  update: {
    updateProduct: `UPDATE product SET come_time=?,product_name=?,product_sku=?,storage_count=?,save_days=?,out_count=?,status=?,out_time = ?  where customer_id= ? and product_code=?`,
    updateTrading: `UPDATE trading_record SET trading_date=?,trading_content=?,trading_amount=?,status=? where trading_code=? and customer_id= ? `,
    updateBox: `UPDATE box SET come_time=?,product_name=?,length_width_height=?,weight=?,count=? ,out_count=? ,save_days=?,status= ?,out_time = ?  where customer_id=? and box_code= ?  `,
  },
};
module.exports = sqlMap;
