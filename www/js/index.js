//alert('begin');
var bluetoothSerial = cordova.require('bluetoothSerial');
var elemBTindicator = document.getElementById('bluetooth_indicator'),
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
            app.logm('Найдено ' + devices.length + ' устройств');           
        }
    },
    connect : function(){
        alert('bluetooth.connect')
        //var id = '00:13:FD:AB:1E:23';
        var id = '00:13:46:01:1F:A9';

        app.logm('Соединение с:'+ id +'...');

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
    openPort: function(){
        bluetoothSerial.subscribe('\n', function (data) {
            app.logm(data);
        });
    }
};
