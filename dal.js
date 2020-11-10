import mysql from 'mysql2/promise'

class Dal {
  async connect() {
    try {
      return await mysql.createConnection({
        host: '0.0.0.0',
        user: 'root',
        password: 'root',
        database: 'db_alteredCarbon'
      })
    } catch (err) {
      console.error('Unable to connect to alteredCarbon database')
      throw err
    }
  }

  async createAsync(realGender, name, age) {
    const connection = await this.connect()

    try {
      const [resultStack] = await connection.query(
          `INSERT INTO CorticalStacks (realGender, name, age) VALUES ('${realGender}', '${name}', '${age}')`
      )
      const [resultEnvelope] = await connection.query(
          `INSERT INTO Envelopes (gender, age, idStack) VALUES ('${realGender}', '${age}', '${resultStack.insertId}')`
      )

      await connection.query(
          `UPDATE CorticalStacks SET idEnvelope='${resultEnvelope.insertId}' WHERE id=${resultStack.insertId}`
      )

      return {
        corticalStackId: resultStack.insertId,
        envelopeId: resultEnvelope.insertId
      }
    } catch (err) {
      console.error(err.message)
    } finally {
      connection.end()
    }
  }
}

export default Dal
