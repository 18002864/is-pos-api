const { Pool, Client } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const table_name = 'product_discount'
const id_from_table = 'id_discount'


const getDiscounts = (request, response) => {
	pool.query(`select * from ${table_name}`, (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getDiscountsById = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`SELECT * FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows[0])
	})
}

const createDiscounts = (request, response) => {
	// console.log('body -------->', request)
    const { id_bodega, sku, starts, ends } = request.body
	// yyyy mm dd
	// console.log('id bodega --------------->', id_bodega)
	// console.log('sku --------------->', sku)
	// console.log('starts --------------->', starts)
	// console.log('ends --------------->', ends)
	pool.query(`insert into ${table_name}
        (id_bodega, sku, starts, ends) values($1,$2,$3,$4)`,
		[ id_bodega, sku, starts, ends ],
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(201).send(`SE HA AGREGADO CON EXITO`)
		})
}

const updateDiscounts = (request, response) => {
	const id = parseInt(request.params.id)
	const { id_bodega, sku, starts, ends } = request.body
	pool.query(
		`UPDATE ${table_name} SET 
        id_bodega = $1, 
        sku = $2,
        starts = $3,
        ends = $4 WHERE ${id_from_table} = $5`,
		[ id_bodega, sku, starts, ends, id ],
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).send(`Modificado con exito`)
		}
	)
}

const deleteDiscounts = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`DELETE FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`Eliminado con exito`)
	})
}

const getDiscountsSKU = (request, response) => {
	const sku = request.params.sku
	pool.query(`SELECT * FROM ${table_name} WHERE sku LIKE $1`, [sku], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows[0])
	})
}

module.exports = {
	getDiscounts,
	getDiscountsById,
	createDiscounts,
	updateDiscounts,
	deleteDiscounts,
	getDiscountsSKU
}