import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()
const io = new Server(httpServer, {cors: {
				origin: "*"
}})
const rooms = new Map()
const clients = new Map()
io.on('connection', (socket) => {
				socket.on('join room', name => {
								name = name.trim()
								console.log(name)
							  if(!name){
												return
								}
								if(!rooms.has(name)){
												rooms.set(name, [])
								}
								rooms.get(name).push(socket)
								clients.set(socket, name)
								console.log('join room: ', name)
								socket.emit('welcome', '')
				})
				socket.on('disconnect', ()=>{
								const roomName = clients.get(socket)
								if(!roomName){
												return
								}
								const room = rooms.get(roomName)
								if(!room){
												return
								}
								const newRoom = room.filter(s => s !== socket)
								if(newRoom.length){
												rooms.set(roomName, newRoom) 
								}else{
												rooms.delete(roomName)
								}
				})
				socket.on('chat message', msg => {
								const roomName = clients.get(socket)
								console.log('chat message: ', msg, '\nin room:', roomName)
								if(!roomName){
												return
								}
								const room = rooms.get(roomName)
								if(!room){
												return
								}
								console.log('members:', room.length)
								for (let s of room){
												if(s === socket){
																continue
												}
												s.emit('chat message', msg);
								}
				})
})
httpServer.listen(9999)
