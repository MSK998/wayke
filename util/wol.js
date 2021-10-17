// See https://github.com/song940/wake-on-lan for original code

const udp = require("dgram");

function createMagicPacket(mac) {
  const MAC_REPEAT = 16;
  const MAC_LENGTH = 0x06;
  const PACKET_HEADER = 0x06;

  const parts = mac.match(/[0-9a-fA-F]{2}/g);

  if (!parts || parts.length != MAC_LENGTH)
    throw new Error(`Malformed MAC address "${mac}"`);

  var buffer = Buffer.alloc(PACKET_HEADER);

  var bufMac = Buffer.from(parts.map((p) => parseInt(p, 16)));

  buffer.fill(0xff);

  for (var i = 0; i < MAC_REPEAT; i++) {
    buffer = Buffer.concat([buffer, bufMac]);
  }
  return buffer;
}

function wake(mac) {
  const { address, port } = Object.assign({
    address: "255.255.255.255",
    port: 9,
  });

  var magicPacket = createMagicPacket(mac);

  var socket = udp
    .createSocket("udp4")
    .on("error", function (err) {
      socket.close();
      throw new Error(`Failed to create socket ${err}`)
    })
    .once("listening", function () {
      socket.setBroadcast(true);
    });

  return new Promise((resolve, reject) => {
    socket.send(
      magicPacket,
      0,
      magicPacket.length,
      port,
      address,
      function (err, res) {
        let result = res == magicPacket.length;
        if (err) reject(err);
        else resolve(result);
        socket.close();
      }
    );
  });
}

module.exports = {
  createMagicPacket,
  wake,
};
