alert('begin');
var bluetoothSerial = cordova.require('bluetoothSerial');
var elemBTindicator = document.getElementById('bluetooth_indicator'),
    elemLogBox = document.getElementById('logs_box');
alert('after var');

var app = {
    // Application Constructor
    initialize: function() {
        alert('app.initialize');

        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        alert('app.bindEvents before');

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    onDeviceReady: function() {
        alert('app.onDeviceReady');

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
    }//,
    // list : function(){
    //     bluetoothSerial.list(app.ondevicelist, app.generateFailureFunction("List Failed"));      
    // }
};