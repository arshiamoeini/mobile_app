#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;

#define SERVICE_UUID        "8c30f045-683a-4777-8d21-87def63e4ef5"
#define CHARACTERISTIC_UUID "e6eae575-4d89-4750-bf3e-c82d6a1cd299"
#define PASSKEY 999999

#define LED_BUILTIN 4    // LED اتصال
#define door_open 2     // LED کنترل با عدد 1
#define door_close 17 
#define boogh 16  //موقع نزدیک شدن یه بوق کوچک

bool deviceConnected = false;
int i = 0;

/////////////////////
// Callback Classes //
/////////////////////

class ServerCallback: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      Serial.println("✅ Connected");
      deviceConnected = true;
      digitalWrite(LED_BUILTIN, HIGH);
      boogh_near();
    }

    void onDisconnect(BLEServer* pServer) {
      Serial.println("❌ Disconnected");
      deviceConnected = false;
      digitalWrite(LED_BUILTIN, LOW);
      boogh_far();
      // بعد از کمی تأخیر دوباره advertise کن
      delay(2000);
      digitalWrite(door_close, HIGH);
      delay(200);
      digitalWrite(door_close, LOW);
      Serial.println("door close you far enough");
      BLEDevice::startAdvertising();
      Serial.println("🔁 Restarted advertising for reconnect...");

    }

    void boogh_near(){
      digitalWrite(boogh,HIGH);
      delay(200);
      digitalWrite(boogh,LOW);
      delay(200);
    }

    void boogh_far(){
      for (i=1;i<4;i++){
        digitalWrite(boogh,HIGH);
        delay(200);
        digitalWrite(boogh,LOW);
        delay(200);
        

      }
      
      
    }
};

class SecurityCallback : public BLESecurityCallbacks {
    uint32_t onPassKeyRequest() {
      Serial.println("📲 Passkey requested");
      return PASSKEY;
    }

    void onPassKeyNotify(uint32_t pass_key) {
      Serial.printf("🔐 Passkey: %06u\n", pass_key);
    }

    bool onConfirmPIN(uint32_t pass_key) {
      Serial.println("✅ Confirming PIN...");
      vTaskDelay(2000);
      return true;
    }

    bool onSecurityRequest() {
      Serial.println("🔒 Security request received");
      return true;
    }
    
      
    void onAuthenticationComplete(esp_ble_auth_cmpl_t cmpl) {
      if (cmpl.success) {
        Serial.println("✅ Authentication successful (bond stored)");
        digitalWrite(LED_BUILTIN, HIGH);
        //boogh_near();
      } 
      else {
        Serial.println("⚠️ Authentication failed!");
        digitalWrite(LED_BUILTIN, LOW);
      }
    }
};

//////////////////////////////
// Characteristic Callbacks //
//////////////////////////////

class CharacteristicCallbacksExample : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pChar) {
        String value = pChar->getValue();

        if (value.length() > 0) {
            Serial.print("Received Value: ");
            Serial.println(value.c_str());

            if (value == "1") {
                digitalWrite(door_open, HIGH);
                Serial.println("✅ LED د باز شد");
                delay(200);            
                digitalWrite(door_open, LOW);
                Serial.println("❌ LED د باز شد");
            }
            if (value == "2") {
                digitalWrite(door_close, HIGH);
                Serial.println("✅ LED د بسته شد");
                delay(200);            
                digitalWrite(door_close, LOW);
                Serial.println("❌ LED د بسته شد");
            }
        }
    }
};

/////////////////////
// BLE Setup Logic //
/////////////////////

void bleSecurity() {
  esp_ble_auth_req_t auth_req = ESP_LE_AUTH_REQ_SC_MITM_BOND;  // با Bond
  esp_ble_io_cap_t iocap = ESP_IO_CAP_OUT;
  uint8_t key_size = 16;
  uint8_t init_key = ESP_BLE_ENC_KEY_MASK | ESP_BLE_ID_KEY_MASK;
  uint8_t rsp_key  = ESP_BLE_ENC_KEY_MASK | ESP_BLE_ID_KEY_MASK;
  uint32_t passkey = PASSKEY;
  uint8_t auth_option = ESP_BLE_ONLY_ACCEPT_SPECIFIED_AUTH_DISABLE;

  esp_ble_gap_set_security_param(ESP_BLE_SM_SET_STATIC_PASSKEY, &passkey, sizeof(uint32_t));
  esp_ble_gap_set_security_param(ESP_BLE_SM_AUTHEN_REQ_MODE, &auth_req, sizeof(uint8_t));
  esp_ble_gap_set_security_param(ESP_BLE_SM_IOCAP_MODE, &iocap, sizeof(uint8_t));
  esp_ble_gap_set_security_param(ESP_BLE_SM_MAX_KEY_SIZE, &key_size, sizeof(uint8_t));
  esp_ble_gap_set_security_param(ESP_BLE_SM_ONLY_ACCEPT_SPECIFIED_SEC_AUTH, &auth_option, sizeof(uint8_t));
  esp_ble_gap_set_security_param(ESP_BLE_SM_SET_INIT_KEY, &init_key, sizeof(uint8_t));
  esp_ble_gap_set_security_param(ESP_BLE_SM_SET_RSP_KEY, &rsp_key, sizeof(uint8_t));
}

void bleInit() {
  BLEDevice::init("BLE-Secure-Server");
  BLEDevice::setEncryptionLevel(ESP_BLE_SEC_ENCRYPT);
  BLEDevice::setSecurityCallbacks(new SecurityCallback());

  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallback());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_WRITE  |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristic->setAccessPermissions(ESP_GATT_PERM_READ_ENCRYPTED | ESP_GATT_PERM_WRITE_ENCRYPTED);
  pCharacteristic->setCallbacks(new CharacteristicCallbacksExample());
  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // reconnect سریع‌تر
  pAdvertising->setMinPreferred(0x12);

  bleSecurity();
  BLEDevice::startAdvertising();

  Serial.println("🚀 BLE Secure Server started and advertising...");
}

/////////////////////
// Arduino Sections //
/////////////////////

void setup() {
  Serial.begin(115200);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  pinMode(door_open, OUTPUT);
  digitalWrite(door_open, LOW);

  pinMode(door_close, OUTPUT);
  digitalWrite(door_close, LOW);

  pinMode(boogh, OUTPUT);
  digitalWrite(boogh, LOW);

  bleInit();
}

void loop() {
  // فقط برای نمایش وضعیت
  if (deviceConnected)
    Serial.println("🔵 Connected...");
  else
    Serial.println("⚫ Waiting for reconnect...");

  delay(2000);
}
