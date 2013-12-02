//alert('begin');
var bluetoothSerial = cordova.require('bluetoothSerial');
var elemBTindicator = document.getElementById('bluetooth_indicator'),
    message = document.getElementById('message'),
    elemLogBox = document.getElementById('logs_box');
//alert('after var');

var app = {
    // Application Constructor
    initialize: function() {
    //    alert('app.initialize');

        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
    //    alert('app.bindEvents before');

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    onDeviceReady: function() {
    //    alert('app.onDeviceReady');

        app.logm('Устройство готово')
        bluetooth.init();
    },
    logm: function(m){
        var newMess = document.createElement('p');
        newMess.innerHTML = m;
        elemLogBox.appendChild(newMess);
    }
};
var bluetooth = {
    init: function(){
        if(bluetoothSerial){
            // Bluetooth init
            bluetooth.isEnabled();
        } else {
            app.logm('bluetoothSerial не инициализирован');
            return false;
        }
    },
    isEnabled: function(){
        bluetoothSerial.isEnabled(
            function() { 
                app.logm('Bluetooth включен');
                elemBTindicator.innerText = 'Bluetooth on';
            },
            function() { 
                app.logm('Bluetooth выключен');
                elemBTindicator.innerText = 'Bluetooth off';
            }
        ); 
    },
    list : function(event){
        alert('bluetooth.list')

        app.logm('Поиск устройств...');
        bluetoothSerial.list(bluetooth.ondevicelist); 
    },
    ondevicelist : function(devices){    
        alert('bluetooth.ondevicelist')

        devices.forEach(function(device) {    
            if (device.hasOwnProperty("uuid")) {
                app.logm('device.uuid:' + device.uuid);
            } else if (device.hasOwnProperty("address")) {
                app.logm('device.address:' + device.address);
            } else {
                app.logm('ERROR:' + JSON.stringify(device));
            }
        });

        if (devices.length === 0) {           
            app.logm("Bluetooth устройства не найдены");               
        } else {
            app.logm('Найдено ' + devices.length + ' Bluetooth устройств');           
        }
    },
    connect : function(){
        alert('bluetooth.connect')
        var id = '00:13:FD:AB:1E:23';
        //var id = '00:13:46:01:1F:A9';

        app.logm('Соединение с: '+ id +'...');

        bluetoothSerial.connect(
            id,
            bluetooth.openPort,
            function(reason) {
                var details = "Ошибка подключения: ";
                if (reason) {
                    details += JSON.stringify(reason);
                }
                app.logm(details);
            }
        );
    },
    disconnect: function(){
        alert('bluetooth.disconnect');

        bluetoothSerial.disconnect(
            function(){
                app.logm('Соединение разорвано');
            },
            function(){
                app.logm('Неудача при разрыве соединения');
            }
        );
    },
    openPort: function(){
        alert('bluetooth.connect success!');
        app.logm('Соединение установлено!');

        bluetooth.available();
        bluetooth.read();
        bluetooth.readUntil();
        bluetooth.subscribe();
    },
    write: function(){
        alert('bluetooth.write');

        var data = message.value + "\n";
        bluetoothSerial.write(data,
            function(){
                app.logm('<b>'+ data +'<b/> отправлено');
            }, function(){
                app.logm('Неудача при отправке <b>'+ data +'<b/>');
            }
        );
    },
    available: function(){
        alert('bluetooth.available');

        bluetoothSerial.available(function (numBytes) {
            app.logm("There are " + numBytes + " available to read.");
        });
    },
    read: function(){
        alert('bluetooth.read');

        bluetoothSerial.read(function (data) {
            app.logm(data);
        });
    },
    readUntil: function(){
        alert('bluetooth.read');

        bluetoothSerial.readUntil('\n', function (data) {
            app.logm(data);
        });
    },
    subscribe: function(){
        alert('bluetooth.subscribe');

        bluetoothSerial.subscribe('\n', function (data) {
            app.logm(data);
        });
    },
    unsubscribe: function(){
        alert('bluetooth.unsubscribe');

        bluetoothSerial.unsubscribe(function () {
            app.logm('Подписка разорвана');
        });
    },
    clear: function(){
        alert('bluetooth.unsubscribe');

        bluetoothSerial.clear(function(){
            app.logm('Буфер очишен');
        });
    },
    isConnected: function(){
        alert('bluetooth.isConnected');

        bluetoothSerial.isConnected(function(connected){
            if(connected){
                app.logm('Соединение присутствует');
            } else {
                app.logm('Соединение отсутствует');

                bluetooth.connect();
            }
        });
    }
};
