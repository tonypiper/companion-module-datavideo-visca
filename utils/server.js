import { createServer } from 'net'

const server = createServer((socket) => {
	log('Client connected')

	socket.on('data', (data) => {
		const receivedData = hexBytes(data).slice(2)
		log(`Recv: ${receivedData.join(' ')}`)

		// Handle VISCA commands here
		const acknowledgement = createVISCAAckPacket()
		socket.write(acknowledgement)
		log(`Send: ${hexBytes(acknowledgement).join(' ')}`)
	})

	socket.on('end', () => {
		log('Client disconnected')
	})
})

const port = 5002
server.listen(port, () => {
	log(`VISCA command server listening on port ${port}`)
})

const createVISCAAckPacket = () => {
	return Buffer.from([0x90, 0x41, 0xff])
}

const hexBytes = (data) => {
	return Array.from(data).map((byte) => byte.toString(16).padStart(2, '0'))
}

const log = (message) => {
	const timestamp = new Date().toISOString()
	console.log(`${timestamp}: ${message}`)
}
