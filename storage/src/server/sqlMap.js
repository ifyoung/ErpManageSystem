// sqlmap.js
var sqlMap = {
  query: {
    // 根据管理员表登录校验
    loginInUser: `SELECT * from user where username=? and password=?`,
    // 根据客户表登录校验
    loginInCustomer: `SELECT * from customer_info where customer_id=? and auto_pwd=?`,
    // 获取所有客户信息
    getCustomer: `select * from customer_info`,
    // 获取客户信息id
    getCustomerId: `select customer_id from customer_info where customer_id = ?`,
    // 根据id获取指定客户信息
    getSpecificCustomer: `select * from customer_info where customer_id = ?`,

    // (货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
    getProductLocate: `SELECT p.customer_id,c.company_name,p.product_name,p.product_sku FROM product p,customer_info c WHERE CONCAT(p.customer_id,c.company_name,p.product_name,p.product_sku) LIKE CONCAT("%",?,"%") `,
    // (时间排序)(货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
    getProductLocateByTime: `SELECT p.*,c.company_name FROM product p,customer_info c WHERE CONCAT(p.customer_id,c.company_name,p.product_name,p.product_sku) LIKE CONCAT("%",?,"%") and p.customer_id = c.customer_id ORDER BY come_time desc`,
    // (名称排序)(货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
    getProductLocateByName: `SELECT p.*,c.company_name FROM product p,customer_info c WHERE CONCAT(p.customer_id,c.company_name,p.product_name,p.product_sku) LIKE CONCAT("%",?,"%") and p.customer_id = c.customer_id ORDER BY product_name desc`,

    // (箱子管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
    getBoxLocate: `SELECT b.customer_id,c.company_name,b.product_name FROM box b,customer_info c WHERE CONCAT(b.customer_id,c.company_name,b.product_name) LIKE CONCAT("%",?,"%")`,
    // (时间排序)(货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
    getBoxLocateByTime: `SELECT b.*,c.company_name FROM box b,customer_info c WHERE CONCAT(b.customer_id,c.company_name,b.product_name) LIKE CONCAT("%",?,"%") and b.customer_id = c.customer_id ORDER BY come_time desc`,
    // (名称排序)(货物管理)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
    getBoxLocateByName: `SELECT b.*,c.company_name FROM box b,customer_info c WHERE CONCAT(b.customer_id,c.company_name,b.product_name) LIKE CONCAT("%",?,"%") and b.customer_id = c.customer_id ORDER BY product_name desc`,

    // 依据客户id或者所属公司获取客户 剩余金额 信息
    getLeaveAmountByCustomerId: `SELECT customer_id,leave_amount from customer_info where customer_id = ?`,
    getLeaveAmountByCompanyName: `SELECT customer_id,leave_amount from customer_info where company_name = ?`,
    // 依据客户id或者所属公司获取客户 充值记录 信息
    getRechargeByCustomerId: `SELECT recharge_date,recharge_amount,real_amount from recharge_record where customer_id = ?`,
    getRechargeByCompanyName: `SELECT recharge_date,recharge_amount,real_amount from recharge_record,customer_info c where c.company_name = ?`,
   
    // (交易记录)模糊查询
    getTradingLocate: `SELECT t.*,c.company_name FROM trading_record t,customer_info c WHERE CONCAT(t.customer_id,c.company_name) LIKE CONCAT("%",?,"%") and t.customer_id = c.customer_id`,
    // (公司名称排序)获取客户 交易记录 信息
    getTradingByName: `SELECT t.*,c.company_name FROM trading_record t,customer_info c WHERE CONCAT(t.customer_id,c.company_name) LIKE CONCAT("%",?,"%") and t.customer_id = c.customer_id ORDER BY c.company_name DESC`,
   
   
    // 查询是否有相同sku
    getSameSku: `Select * From product where customer_id = ? and product_name = ? and product_sku = ?`,

    // (出库记录)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
    getOutRecordLocate: `SELECT o.out_source,o.customer_id,c.company_name,o.product_name,o.product_sku FROM out_record o,customer_info c WHERE CONCAT(o.customer_id,o.product_sku,o.product_name,c.company_name,o.out_source) LIKE CONCAT("%",?,"%") and o.status='false' and o.customer_id = c.customer_id  ORDER BY o.out_time desc`,
    // (时间排序)获取所有 出库记录 信息
    getAllOutRecord: `SELECT c.customer_id,c.company_name,o.out_count,o.out_time,o.product_name,o.product_sku,o.record_code,o.status,o.out_source FROM  out_record o,customer_info c where c.customer_id = o.customer_id and o.status = 'false' ORDER BY o.out_time DESC`,
    // (时间排序)(出库记录)依据客户信息(可以是客户编号、公司名称、货品名称、货品sku)模糊查询
    getOutRecordLocateByTime: `SELECT c.customer_id,c.company_name,o.out_count,o.out_time,o.product_name,o.product_sku,o.record_code,o.status,o.out_source FROM  out_record o,customer_info c WHERE CONCAT(o.product_sku,o.product_name,c.company_name,c.customer_id,o.out_source) LIKE CONCAT("%",?,"%") and o.customer_id = c.customer_id ORDER BY o.out_time desc`,


    // 添加、修改框下的模糊查询
    // 客户信息模糊查询
    getCustomerDialogLocate:`select c.customer_id,c.company_name from customer_info c where CONCAT(c.customer_id,c.company_name) like CONCAT("%",?,"%")`,
    // 货物信息模糊查询
    getProductDialogLocate:`select c.customer_id,p.product_name,p.product_sku from product p,customer_info c where CONCAT(c.customer_id,p.product_name,p.product_sku) like CONCAT("%",?,"%")`,
    // 箱子信息模糊查询
    getBoxDialogLocate:`select c.customer_id,b.product_name,b.length_width_height from box b,customer_info c where CONCAT(c.customer_id,b.product_name,b.length_width_height) like CONCAT("%",?,"%")`,
    // 获取地址
    getAddress: `SELECT * FROM address where record_code = ?`,
  },
  insert: {
    insertCustomer: `INSERT INTO customer_info VALUES(?,?,?,?,?)`,
    insertProduct: `INSERT INTO product VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    insertTrading: `INSERT INTO trading_record VALUES(?,?,?,?,?,?)`,
    insertBox: `INSERT INTO box VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    insertOutRecord: `INSERT INTO out_record VALUES(?,?,?,?,?,?,?,?)`,
    insertAddress: `INSERT INTO address VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`,
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
    updateOutRecordWithBox: `update out_record o,box b set o.status = ?,b.out_count = b.out_count - o.out_count where b.customer_id = o.customer_id and b.out_time = o.out_time and b.product_name = o.product_name and o.customer_id = ? and o.product_name= ? and o.out_count= ? and o.product_sku = ? and b.out_time = ? and o.record_code = ?`,
    updateOutRecordWithProduct: `update out_record o,product p set o.status= ?,p.out_count = p.out_count - o.out_count where p.customer_id = o.customer_id and p.product_sku = o.product_sku and p.product_name = o.product_name and o.customer_id = ? and o.product_name= ? and o.out_count= ? and o.product_sku = ?  and o.record_code = ? `,
    updateSpecificCustomer: `update customer_info c set c.customer_id=?,c.company_name=?,c.first_come_time=?,c.leave_amount = ?,c.auto_pwd = ? where c.customer_id =?`,
  },
};
module.exports = sqlMap;
