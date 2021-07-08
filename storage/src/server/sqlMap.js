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
    getProductByCustomerId: `SELECT * FROM product p,customer_info c where p.customer_id=c.customer_id  and p.customer_id = ?`,
    getProductByCompanyName: `SELECT * FROM product p,customer_info c  where p.customer_id=c.customer_id and c.company_name = ?`,
    // 获取所有货品信息
    getAllProduct: `SELECT * FROM product p,customer_info c where p.customer_id = c.customer_id`,
    // 依据客户id或者所属公司获取 箱子 信息
    getBoxByCustomerId: `SELECT * FROM box b,customer_info c where b.customer_id = c.customer_id and b.customer_id = ?`,
    getBoxByCompanyName: `SELECT * FROM box b,customer_info c  where b.customer_id=c.customer_id and c.company_name = ?`,
    // 获取所有 箱子 信息
    getAllBox: `SELECT * FROM box b,customer_info c where b.customer_id = c.customer_id`,
    // 依据客户id或者所属公司获取客户 剩余金额 信息
    getLeaveAmountByCustomerId: `SELECT customer_id,leave_amount from customer_info where customer_id = ?`,
    getLeaveAmountByCompanyName: `SELECT customer_id,leave_amount from customer_info where company_name = ?`,
    // 依据客户id或者所属公司获取客户 充值记录 信息
    getRechargeByCustomerId: `SELECT recharge_date,recharge_amount,real_amount from recharge_record where customer_id = ?`,
    getRechargeByCompanyName: `SELECT recharge_date,recharge_amount,real_amount from recharge_record,customer_info c where c.company_name = ?`,
    // 依据客户id或者所属公司获取客户 交易记录 信息
    getTradingByCustomerId: `SELECT  c.customer_id,c.company_name,t.trading_code,t.trading_amount,t.trading_content,t.trading_date,t.status FROM  trading_record t,customer_info c where c.customer_id = t.customer_id and t.customer_id = ? `,
    getTradingByCompanyName: `SELECT  c.customer_id,c.company_name,t.trading_code,t.trading_amount,t.trading_content,t.trading_date,t.status FROM  trading_record t,customer_info c where c.customer_id = t.customer_id and c.company_name = ?`,
    // 获取所有 交易 信息
    getAllTrading: `SELECT  c.customer_id,c.company_name,t.trading_code,t.trading_amount,t.trading_content,t.trading_date,t.status FROM  trading_record t,customer_info c where c.customer_id = t.customer_id`,
    // 查询是否有相同sku
    getSameSku: `Select * From product where customer_id = ? and product_name = ? and product_sku = ?`,
    // 依据客户id或者所属公司获取 出库记录 信息
    getOutRecordByCustomerId: `SELECT  c.customer_id,c.company_name,o.out_count,o.out_time,o.product_name,o.product_sku FROM  out_record o,customer_info c where c.customer_id = o.customer_id  and where customer_id = ?`,
    getOutRecordByCompanyName: `SELECT  c.customer_id,c.company_name,o.out_count,o.out_time,o.product_name,o.product_sku FROM  out_record o,customer_info c where c.customer_id = o.customer_id  and and LOCATE c.company_name = ? (?,c> 0`,
    // 获取所有 出库记录 信息
    getAllOutRecord: `SELECT  c.customer_id,c.company_name,o.out_count,o.out_time,o.product_name,o.product_sku,o.record_code,o.status FROM  out_record o,customer_info c where c.customer_id = o.customer_id `,
  },
  insert: {
    insertCustomer: `INSERT INTO customer_info VALUES(?,?,?,?)`,
    insertProduct: `INSERT INTO product VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    insertTrading: `INSERT INTO trading_record VALUES(?,?,?,?,?,?)`,
    insertBox: `INSERT INTO box VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    
    insertOutRecord: `INSERT INTO out_record VALUES(?,?,?,?,?,?,?)`,
  },
  delete: {
    deleteCustomer: `delete from customer_info where customer_id IN (?) `,
    deleteTrading: `delete from trading_record 
    where customer_id=?
    and trading_code=?`,
    deleteProduct: `delete from product where customer_id=? and product_code=?`,
    deleteBox: `delete from box where customer_id=? and box_code=?`,
    deleteOutRecord: `delete from out_record where customer_id=? and product_name=? and product_sku= ? and out_time= ? and out_count=? and record_code= ?`,
  },
  update: {
    updateProduct: `UPDATE product SET come_time=?,product_name=?,product_sku=?,storage_count=?,save_days=?,out_count=?,status=?,out_time = ?,record_code = ?  where customer_id= ? and product_code=?`,
    updateTrading: `UPDATE trading_record SET trading_date=?,trading_content=?,trading_amount=?,status=? where trading_code=? and customer_id= ? `,
    updateBox: `UPDATE box SET come_time=?,product_name=?,length_width_height=?,weight=?,count=? ,out_count=? ,save_days=?,status= ?,out_time = ?,record_code = ?  where customer_id=? and box_code= ?  `,
    updateOutRecordWithBox:`update out_record o,box b set o.status = ?,b.out_count = b.out_count - o.out_count where b.customer_id = o.customer_id and b.out_time = o.out_time and b.product_name = o.product_name and o.customer_id = ? and o.product_name= ? and o.out_count= ? and o.product_sku = ? and b.out_time = ? and o.record_code = ?`,
    updateOutRecordWithProduct:`update out_record o,product p set o.status= ?,p.out_count = p.out_count - o.out_count where p.customer_id = o.customer_id and p.product_sku = o.product_sku and p.product_name = o.product_name and o.customer_id = ? and o.product_name= ? and o.out_count= ? and o.product_sku = ?  and o.record_code = ? `,
  },
};
module.exports = sqlMap;
