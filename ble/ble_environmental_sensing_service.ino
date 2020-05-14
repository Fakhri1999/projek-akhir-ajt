#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h> //Library to use BLE as server
#include <BLE2902.h> 
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11
bool _BLEClientConnected = false;

#define EnviromentalSensing BLEUUID((uint16_t)0x181A) 

BLECharacteristic Temperature(BLEUUID((uint16_t)0x2A6E), BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
BLECharacteristic Humidity(BLEUUID((uint16_t)0x2A6F), BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);

//Humidity.addDescriptor(new BLE2902());
//Temperature.addDescriptor(new BLE2902());

class MyServerCallbacks : public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      _BLEClientConnected = true;
    };

    void onDisconnect(BLEServer* pServer) {
      _BLEClientConnected = false;
    }
};

void InitBLE() {
  BLEDevice::init("BLE Enviromental Sensing");
  // Create the BLE Server
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pEnviSense = pServer->createService(EnviromentalSensing);

  pEnviSense->addCharacteristic(&Temperature);
  pEnviSense->addCharacteristic(&Humidity);
  
  pServer->getAdvertising()->addServiceUUID(EnviromentalSensing);

  pEnviSense->start();
  // Start advertising
  pServer->getAdvertising()->start();
}


DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  Serial.println("Eviromental Sensing Indicator - BLE");
  InitBLE();
  dht.begin();
}
  
void loop() {
  delay(2000);
   
  float humid = dht.readHumidity();
  float temp = dht.readTemperature();
  int16_t humidBle = (humid*100);
  int16_t tempBle = (temp*100);
  
  Humidity.setValue((uint8_t*)&humidBle, 2);
  Humidity.notify();
  Temperature.setValue((uint8_t*)&tempBle, 2);
  Temperature.notify();

  Serial.print("Humidity : ");
  Serial.println(humid);

  Serial.print("Temperature : ");
  Serial.println(temp);

}
