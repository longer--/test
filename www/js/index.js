var bluetoothSerial = cordova.require('bluetoothSerial');
var app = {
    initialize: function() {
        this.bindEvents();
    },
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        _log('Устройство готово');
        bluetooth.init();
        iface.init();
    }
};
var bluetooth = {
    init: function(){
        bluetoothSerial.isEnabled(function(enabled) { 
            if(enabled){
                _log('Bluetooth включен');
                $('#bluetooth_indicator').text('Bluetooth on');
            } else {
                _log('Bluetooth выключен');
                $('#bluetooth_indicator').text('Bluetooth off');
            }
        }); 
    },
    list : function(event){
        _log('Доступные устройства:','inf');
        bluetoothSerial.list(bluetooth.ondevicelist); 
    },
    ondevicelist : function(devices){
        devices.forEach(function(device) {
            var deviceOpt = {};

            if (device.hasOwnProperty('name')) deviceOpt.Name = device.name;
            if (device.hasOwnProperty('class')) deviceOpt.Class = device.class;
            if (device.hasOwnProperty('uuid')) deviceOpt.Uuid = device.hasOwnProperty.uuid;
            if (device.hasOwnProperty('address')) deviceOpt.Address = device.address;
            deviceOpt.err = JSON.stringify(device)

            iface.deviceLabelBuild(deviceOpt);
        });

        if (devices.length === 0) {           
            _log('Bluetooth устройства не найдены','err');               
        } else {
            _log('Найдено ' + devices.length + ' Bluetooth устройств');           
        }
    },
    connect : function(address){
        _log('Соединение с: '+ address +' ...');

        bluetoothSerial.connect(
            address,
            function(){
                _log('Соединение c '+ address +' установлено','suc');
                iface.connectIndicator.success(address)
                
                bluetooth.available();
                bluetooth.read();
                bluetooth.readUntil();
                bluetooth.subscribe();
            },
            function(reason) {
                _log('Ошибка подключения: '+ JSON.stringify(reason), 'err');
                iface.connectIndicator.notConnect();
            }
        );
    },
    disconnect: function(){
        bluetoothSerial.disconnect(
            function(){
                _log('Соединение разорвано');
            }
        );
    },
    write: function(data){
        bluetoothSerial.write(data,
            function(){
                _log('Отправка <b>'+ data +'<b/> ...');
            }, function(){
                _log('Неудача при отправке <b>'+ data +'<b/>','err');
            }
        );
    },
    available: function(){
        bluetoothSerial.available(function (numBytes) {
            _log("There are " + numBytes + " available to read",'inf');
        });
    },
    read: function(){
        bluetoothSerial.read(function (data) {
            _log('Read: '+ data, 'inf');
        });
    },
    readUntil: function(){
        bluetoothSerial.readUntil('\n', function (data) {
            _log('ReadUntil: '+ data, 'inf');
        });
    },
    subscribe: function(){
        bluetoothSerial.subscribe('\n', function (data) {
            _log('Subscribe: '+ data, 'inf');
        });
    },
    unsubscribe: function(){
        bluetoothSerial.unsubscribe(function () {
            _log('Unsubscribe');
        });
    },
    clear: function(){
        bluetoothSerial.clear(function(){
            _log('Буфер очищен');
        });
    },
    isConnected: function(){
        bluetoothSerial.isConnected(
            function(connected){
                _log('Соединение: '+ connected);
            }, 
            function(){
                _log('Соединение отсутствует');
                iface.connectIndicator.notConnect()
            }
        );
    }
};
var iface = {
    init: function(){
        iface.tabs();
        iface.bind();
    },
    bind: function(){
        $('#btnWrite').on('click', function(){ iface.write(); return false;});
        $('#btnConnect').on('click', function(){ iface.connect(); return false;});
        $('#btnList').on('click', function(){ bluetooth.list(); return false;});
        $('#btn0xC0').on('click', function(){ bluetooth.write('\u00c0'); return false;});

        $('#btnSubscribe').on('click', function(){ bluetooth.subscribe(); return false;});
        $('#btnReadUntil').on('click', function(){ bluetooth.readUntil(); return false;});
        $('#btnRead').on('click', function(){ bluetooth.read(); return false;});
        $('#btnAvailable').on('click', function(){ bluetooth.available(); return false;});

        $('#btnUnsubscribe').on('click', function(){ bluetooth.unsubscribe(); return false;});
        $('#btnClear').on('click', function(){ bluetooth.clear(); return false;});
        $('#btnDisconnect').on('click', function(){ bluetooth.disconnect(); return false;});
        $('#btnClearLogs').on('click', function(){ iface.clearLogs(); return false;});

        $('#connect_indicator').on('click', function(){ bluetooth.isConnected(); return false;});
        
        $('#logs_short').on('click', '.btn_device_address', function(){ 
            iface.deviceLabelHandler($(this));
            return false;
        });
    },
    tabs: function(){
        var $tabBtn = $('.tab_btn'),
            $tabCont = $('.tab_cont');

        $tabBtn.on('click', function(){
            var $this = $(this),
                id = $this.attr('href');
            $tabBtn.removeClass('active');
            $tabCont.removeClass('active');
            $this.addClass('active');
            $(id).addClass('active');
            return false;
        });
    },
    write: function(){
        var data = $('#postArea').val();
        bluetooth.write(data);
        $('#postArea').val('');
    },
    connect : function(){
        var data = $('#postArea').val();
        bluetooth.connect(data);
        $('#postArea').val('');
    },
    connectIndicator : {
        success : function(addr){
            if (!(addr)) return false;
            var m = 'Подключено к '+ addr;
            $('#connect_indicator').text(m);
        },
        notConnect : function(){
            var m = 'Подключения отсутствуют';
            $('#connect_indicator').text(m);
        }
    },
    messageLog: function(m,t){
        var logCont = $('#logs_page, #logs_short'),
            type = '';

        if (t) type = 'class="'+ t +'"';
        logCont.append('<p '+ type +'>'+ m +'</p>')
    },
    deviceLabelBuild: function(o){
        var idDevice = [];

        if(o.Name) idDevice.push('<span class="name">Name: '+ o.Name +'</span>');
        if(o.Class) idDevice.push('<span class="class">Class: '+ o.Class +'</span>');
        if(o.Uuid) idDevice.push('<span class="uuid">'+ o.Uuid +'</span>');
        if(o.Address) idDevice.push('<span class="address">'+ o.Address +'</span>');
        if(!(o.Name || o.Class || o.Uuid || o.Address)) idDevice.push('<span class="error">'+
            o.err +'</span>');

        _log('<a class="btn_device_address" href="#">'+ idDevice.join('') +'</a>')
    },
    deviceLabelHandler: function(link){
        var addr;
        if (link.find('.uuid')) addr = link.find('.uuid').text();
        if (link.find('.address')) addr = link.find('.address').text();
        $('#postArea').val(addr);
    },
    clearLogs : function(){
        $('#logs_short').text('');
    }
}
var _log = iface.messageLog;