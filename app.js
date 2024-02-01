const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let counter = 0;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const generateGuide = async () => {
  try {
    const guideData = {
        origin: {
          "name": "oscar mx",
          "company": "oskys factory",
          "email": "osgosf8@gmail.com",
          "phone": "8116300800",
          "street": "av vasconcelos",
          "number": "1400",
          "district": "mirasierra",
          "city": "Monterrey",
          "state": "NL",
          "country": "MX",
          "postalCode": "66236",
          "reference": ""
        },
        destination: {
          "name": "oscar",
          "company": "empresa",
          "email": "osgosf8@gmail.com",
          "phone": "8116300800",
          "street": "av vasconcelos",
          "number": "1400",
          "district": "palo blanco",
          "city": "monterrey",
          "state": "NL",
          "country": "MX",
          "postalCode": "66240",
          "reference": ""
        },
        packages: [
          {
              "content": "camisetas rojas",
              "amount": 2,
              "type": "box",
              "dimensions": {
                  "length": 2,
                  "width": 5,
                  "height": 5
              },
              "weight": 63,
              "insurance": 0,
              "declaredValue": 400,
              "weightUnit": "KG",
              "lengthUnit": "CM"
          },
        ],
        shipment: {
          "carrier": "fedex",
          "service": "express",
          "type": 1
        },
        settings: {
          "printFormat": "PDF",
          "printSize": "STOCK_4X6",
          "comments": "comentarios de el envío"
        }
      };

    // const response = await axios.post('https://api.envia.com/ship/generate/', guideData, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer1fd4c8df0adccf268c433fff7469a9a14e4d1ae3f8ca72a1de9831bacecaa238',
    //   }
    // });

    //Simular response
    const response = {
        status: 200,
        meta: "generate",
        data: [
          {
            carrier: "ups",
            service: "ground",
            trackingNumber: "1Z68W99A4297214308",
            trackUrl: "https://envia.com/rastreo?label=1Z68W99A4297214308&cntry_code=us",
            label: "https://s3.us-east-2.amazonaws.com/enviapaqueteria/uploads/ups/1Z68W99A42972143081118461362db7dbe1c.pdf",
            additionalFiles: [],
            totalPrice: 257.12,
            currentBalance: 8230.67,
            currency: "MXN"
          }
        ]
      };

    console.log('Guía generada:', response.data);
    const guide = response.data[0];

    if (response.status === 200) {
      counter++;
      io.emit('updateCounter', counter);

      io.emit('guideGenerated', {
        carrier: guide.carrier,
        trackingNumber: guide.trackingNumber,
        totalPrice: guide.totalPrice,
        currency: guide.currency,
      });
    }
  } catch (error) {
    console.error('Error al generar la guía:', error);
  }
};

io.on('connection', (socket) => {
  socket.emit('updateCounter', counter);

  socket.on('generateGuide', () => {
    generateGuide();
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
