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

  async getAllStacksAsync() {
    const connection = await this.connect()

    try {
      const [result] = await connection.query(`SELECT * FROM CorticalStacks`)
      return result
    } catch (err) {
      console.error(err.message)
    } finally {
      connection.end()
    }
  }

  async getAllEnvelopesAsync() {
    const connection = await this.connect()

    try {
      const [result] = await connection.query(`SELECT * FROM Envelopes`)
      return result
    } catch (err) {
      console.error(err.message)
    } finally {
      connection.end()
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

  async killEnvelopeAsync(envelope) {
    const connection = await this.connect()

    try {
      await this.removeEnvelopeByIdAsync(envelope.id)
      await this.removeEnvelopeFromStackAsync(envelope.idStack)
    } catch (err) {
      console.error(err.message)
    } finally {
      connection.end()
    }
  }

  async removeEnvelopeFromStackAsync(idStack) {
    const connection = await this.connect()

    try {
      await connection.query(`UPDATE CorticalStacks SET idEnvelope=NULL WHERE id=${idStack}`)

    } catch (err) {
      console.error(err.message)
    } finally {
      connection.end()
    }
  }


  async removeStackFromEnvelopeAsync(stackId, envelopeId) {
    const connection = await this.connect()

    try {
      await connection.query(`UPDATE Envelopes SET idStack=NULL WHERE id=${envelopeId}`)
      await this.removeEnvelopeFromStackAsync(stackId)

    } catch (err) {
      console.error(err.message)
    } finally {
      connection.end()
    }
  }

  async removeStackByIdAsync(idStack) {
    const connection = await this.connect()

    try {
      await connection.query(`DELETE FROM CorticalStacks WHERE id=${idStack}`)
    } catch (err) {
      console.error(err.message)
    } finally {
      connection.end()
    }
  }

  async removeEnvelopeByIdAsync(idEnvelope) {
    const connection = await this.connect()

    try {
      await connection.query(`DELETE FROM Envelopes WHERE id=${idEnvelope}`)
    } catch (err) {
      console.error(err.message)
    } finally {
      connection.end()
    }
  }
}

export default Dal
