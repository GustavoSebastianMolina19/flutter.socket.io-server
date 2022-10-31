const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bans');

const bands = new Bands();
bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Heroes del silecio'));
bands.addBand(new Band('Metalica'));


//Mensajes Sockets
io.on('connection', client => {
    
    console.log('Cliente conectado');

    client.emit('Active-bands', bands.getBands());
    
    client.on('disconnect', () => { 
        console.log('Cliente desconectado'); 
    });
    
    client.on('mensaje', (payload)=>{
        console.log('Mensajee!!!', payload)

        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('emitir-mensaje', (payload) => {
        client.broadcast.emit('nuevo-mensaje', payload)
    });

    client.on('vote-band', (payload) => {
       
        bands.voteBand(payload.id);
        io.emit('Active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        let banda = new Band(payload.name);
        bands.addBand(banda);
        io.emit('Active-bands', bands.getBands());
    })

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('Active-bands', bands.getBands());
    })
});