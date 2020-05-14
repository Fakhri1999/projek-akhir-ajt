let hostname = window.location.hostname;
let protocol = window.location.protocol;
let useSSL = hostname == "localhost" || protocol == "file:" ? false : true;

// Create a client instance
client = new Paho.MQTT.Client(
  "mqtt.flespi.io",
  useSSL ? Number(443) : Number(80),
  `client-id-${parseInt(Math.random() * 1000)}`
);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({
  onSuccess: onConnect,
  useSSL: useSSL,
  userName: "GctC7MzxjjO0UbiiIfxEQrBf7N6OOiQii9IfJ8BQhfGZfO6NTtfyIGBFhxhUEV2M",
  password: ""
});
$("#led").bootstrapToggle("disable");

// called when the client connects
function onConnect() {
  isSensorActive();
  console.log("onConnect");
  client.subscribe("node/#");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  console.log(responseObject);
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  let topic = message.destinationName;
  let value = message.payloadString;
  topic = topic.split("/");
  console.log(topic)
  if (topic[1] == "temperature") {
    $("#temperature").html(value);
    $("#temperature")
      .parent()
      .addClass("blink");
    setTimeout(function() {
      $("#temperature")
        .parent()
        .removeClass("blink");
    }, 500);
  } else if (topic[1] == "humidity") {
    $("#humidity").html(value);
    $("#humidity")
      .parent()
      .addClass("blink");
    setTimeout(function() {
      $("#humidity")
        .parent()
        .removeClass("blink");
    }, 500);
  } else if (topic[1] == "battery") {
    $("#battery").html(value);
    $("#battery")
      .parent()
      .addClass("blink");
    setTimeout(function() {
      $("#battery")
        .parent()
        .removeClass("blink");
    }, 500);
  }
  firstMessage = true;
  console.log(`${topic[1]} : ${value}`);
}

let firstMessage = false;

function isSensorActive() {
  setTimeout(function() {
    if (!firstMessage) {
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: "The sensor is currently offline"
      });
    } else {
      $("#led").bootstrapToggle("enable");
    }
  }, 3000);
}
