javascript: set_homepage();javascript: get_band();function refreshData() {$.ajax({type: "GET",async: true,url: '/api/device/information',success: function (data) {vars = [ 'WanIPAddress', 'wan_dns_address' ];for (i = 0; i < vars.length; i++) {window[vars[i]] = getData(vars[i], data);$('#' + vars[i]).html(window[vars[i]]);}}});$.ajax({type: "GET",async: true,url: '/api/device/signal',success: function (data) {vars = [ 'rssi', 'rsrp', 'rsrq', 'sinr', 'dlbandwidth', 'ulbandwidth', 'ulfrequency', 'dlfrequency', 'pci', 'band', 'cell_id', 'nei_cellid', 'txpower' ];for (i = 0; i < vars.length; i++) {window[vars[i]] = getData(vars[i], data);if (vars[i] == 'txpower') {var arrtx = window[vars[i]].split(" ");var out = "";arrtx.forEach(e => {out = out + e + "<br/>";});$('#' + vars[i]).html(out);} else if (vars[i] == 'nei_cellid') {var arrtx = window[vars[i]].split("No");var out = "";arrtx.forEach(e => {if (e != '') {out = out + e + "<br/>";}});$('#' + vars[i]).html(out);} else {if (vars[i] == 'rsrp') {set_prg_rsrp(window[vars[i]]);} else if (vars[i] == 'rsrq') {set_prg_rsrq(window[vars[i]]);} else if (vars[i] == 'sinr') {set_prg_sinr(window[vars[i]]);} else if (vars[i] == 'rssi') {set_prg_rssi(window[vars[i]]);}$('#' + vars[i]).html(window[vars[i]]);}}hex = Number(cell_id).toString(16);hex2 = hex.substring(0, hex.length - 2);enbid = parseInt(hex2, 16);$('#enbid').html(enbid);}});}function getData(tag, data) {try {return data.split("</" + tag + ">")[0].split("<" + tag + ">")[1];} catch (err) {return err.message;}}function set_band_conf(data) {console.log(data);data_out = "";if (data == 1) {data_out = "B1";document.getElementById('band_1').checked = true;}if (data == 4) {data_out = "B3";document.getElementById('band_3').checked = true;}if (data == 5) {data_out = "B1+B3";document.getElementById('band_1').checked = true;document.getElementById('band_3').checked = true;}if (data == 80) {data_out = "B8";document.getElementById('band_8').checked = true;}if (data == 8000000000) {data_out = "B40";document.getElementById('band_40').checked = true;}if (data == 'A000000095') {data_out = "AUTO";document.getElementById('band_auto').checked = true;document.getElementById('band_1').checked = false;document.getElementById('band_3').checked = false;document.getElementById('band_8').checked = false;document.getElementById('band_40').checked = false;}return data_out;}function get_band() {$.ajax({type: "GET",async: true,url: '/api/net/net-mode',success: function (data) {lteband = getData('LTEBand', data);$('#allowed').html(set_band_conf(lteband));}});}function set_band() {$("#band").html("<span style=\"color:red;\">Wait!</span>");var lteset = 0;var band_auto = document.getElementById('band_auto').checked;var band_1 = document.getElementById('band_1').checked;var band_3 = document.getElementById('band_3').checked;var band_8 = document.getElementById('band_8').checked;var band_40 = document.getElementById('band_40').checked;if (band_1 == true) {lteset = 1;} else if (band_3 == true) {lteset = 4;} else if (band_8 == true) {lteset = 80;} else if (band_40 == true) {lteset = 8000000000;}if (band_1 == true && band_3 == true) {lteset = 5;}if (band_auto == true) {lteset = A000000095;}$.ajax({type: "GET",async: true,url: '/html/home.html',success: function (data) {var datas = data.split('name="csrf_token" content="');var token = datas[datas.length - 1].split('"')[0];setTimeout(function () {$.ajax({type: "POST",async: true,url: '/api/net/net-mode',headers: {'__RequestVerificationToken': token},contentType: 'application/xml',data: '<request><NetworkMode>03</NetworkMode><NetworkBand>3FFFFFFF</NetworkBand><LTEBand>' + lteset + '</LTEBand></request>',success: function (nd) {$("#band").html("<span style=\"color:green;\">Success!</span>");get_band();}});}, 2000);}});}function set_prg_rsrp(val) {var str = val.replace('-', '').replace('dBm', '');if (str <= 80) {document.getElementById("pr_rsrp").innerHTML = '<b>(Excellent)</b>';document.getElementById("pr_rsrp").style = 'color: blue;accent-color: currentcolor;';} else if (str >= 80 && str <= 90) {document.getElementById("pr_rsrp").innerHTML = '<b>(Good)</b>';document.getElementById("pr_rsrp").style = 'color: green;accent-color: currentcolor;';} else if (str >= 90 && str <= 75) {document.getElementById("pr_rsrp").innerHTML = '<b>(Medium)</b>';document.getElementById("pr_rsrp").style = 'color: orange;accent-color: currentcolor;';} else if (str >= 100) {document.getElementById("pr_rsrp").innerHTML = '<b>(Weak)</b>';document.getElementById("pr_rsrp").style = 'color: red;accent-color: currentcolor;';}}function set_prg_rsrq(val) {var str = val.replace('-', '').replace('dB', '');if (str <= 10) {document.getElementById("pr_rsrq").innerHTML = '<b>(Excellent)</b>';document.getElementById("pr_rsrq").style = 'color: blue;accent-color: currentcolor;';} else if (str >= 10 && str <= 15) {document.getElementById("pr_rsrq").innerHTML = '<b>(Good)</b>';document.getElementById("pr_rsrq").style = 'color: green;accent-color: currentcolor;';} else if (str >= 15 && str <= 20) {document.getElementById("pr_rsrq").innerHTML = '<b>(Medium)</b>';document.getElementById("pr_rsrq").style = 'color: orange;accent-color: currentcolor;';} else if (str >= 20) {document.getElementById("pr_rsrq").innerHTML = '<b>(Weak)</b>';document.getElementById("pr_rsrq").style = 'color: red;accent-color: currentcolor;';}}function set_prg_sinr(val) {var str = parseInt(val.replace('-', '').replace('dB', ''));if (str >= 20) {$('#prog_sinr').val(100);document.getElementById("pr_sinr").innerHTML = '<b>(Excellent)</b>';document.getElementById("pr_sinr").style = 'color: blue;accent-color: currentcolor;';} else if (str >= 13 && str < 20) {document.getElementById("pr_sinr").innerHTML = '<b>(Good)</b>';document.getElementById("pr_sinr").style = 'color: green;accent-color: currentcolor;';} else if (str > 0 && str < 13) {$('#prog_sinr').val(50);document.getElementById("pr_sinr").innerHTML = '<b>(Medium)</b>';document.getElementById("pr_sinr").style = 'color: orange;accent-color: currentcolor;';} else if (str <= 0) {$('#prog_sinr').val(25);document.getElementById("pr_sinr").innerHTML = '<b>(Weak)</b>';document.getElementById("pr_sinr").style = 'color: red;accent-color: currentcolor;';}}function set_prg_rssi(val) {var str = val.replace('-', '').replace('dBm', '').replace('>=', '');if (str <= 65) {document.getElementById("pr_rssi").innerHTML = '<b>(Excellent)</b>';document.getElementById("pr_rssi").style = 'color: blue;accent-color: currentcolor;';} else if (str >= 65 && str <= 75) {document.getElementById("pr_rssi").innerHTML = '<b>(Good)</b>';document.getElementById("pr_rssi").style = 'color: green;accent-color: currentcolor;';} else if (str >= 75 && str <= 85) {document.getElementById("pr_rssi").innerHTML = '<b>(Medium)</b>';document.getElementById("pr_rssi").style = 'color: orange;accent-color: currentcolor;';} else if (str >= 85 && str <= 95) {document.getElementById("pr_rssi").innerHTML = '<b>(Poor)</b>';document.getElementById("pr_rssi").style = 'color: orange;accent-color: currentcolor;';} else if (str >= 95) {document.getElementById("pr_rssi").innerHTML = '<b>(No signal)</b>';document.getElementById("pr_rssi").style = 'color: red;accent-color: currentcolor;';}}function set_homepage() {document.getElementById("home_page").innerHTML = '';document.getElementById("home_page").innerHTML = '<div class="clearboth" align="center" style="margin:0 auto;"><div class="home_status_topo home_status_topo_left" style="margin:0 auto;"><div id="home_dual_wan" class="pull-left" style="margin-top:40px;height:98px;max-width:210px;"><a id="home_wan_status" href="#mobileconnection" target="_self" rel="noopener noreferrer" style="display:block;" class="home_sim_on_5"></a><div class="clearboth" style="margin-top: 5px; display: inline-block;"><div id="plmn_roam_box" class="pull-left margin-right-5" style="display: table; height: 22px;" align="center"><span id="home_plmn_description" class="secondmenu_child" style="">4G</span>&nbsp;<em style="height: 20px; font-size: 18px; display: none;" id="roam_icon" class="eth_no_connected hide" lang-id-set="title" lang-id="statistic.roaming" title="Roaming">&nbsp;&nbsp;&nbsp;&nbsp;</em></div><div id="home_wan_description" class="pull-left" style="display: table;height: 20px;"><div class="secondmenu_child">TELKOMSEL</div></div></div></div><div class="pull-left" id="home_wan_connect_info" style="width:240px;margin:0 auto;font-size:14px;"><div id="home_wan_connected_status" class="hide color_Darkgray" style="margin: 0px auto; display: block;" align="center"><table cellpadding="0" cellspacing="0" frame="void" rules="none" style="height:148px;width:160px;"><tbody><tr><td><table cellpadding="0" cellspacing="0" frame="void" rules="none" id="wan_connect_rate" class="pointer hide" style="margin-top: 72px; display: table;" align="center" onclick="EMUI.homeStatusDetectController.jumpToPage();"><tbody><tr><td><div class="home_up">&nbsp;</div></td><td><div class="home_icon_text_split" id="home_up_rate">0bps</div></td></tr><tr><td><div class="home_down">&nbsp;</div></td><td><div class="home_icon_text_split" id="home_down_rate">11.9Kbps</div></td></tr></tbody></table><div id="home_traffic_overflow" style="margin-top: 38px; text-align: center; display: none;" class="hide pointer"></div></td></tr><tr><td style="height:25px;"><div id="home_wan_connect_status" class="home_connect_ok"></div></td></tr></tbody></table></div><div id="home_wan_disconnected_status" class="hide color_Darkgray" style="margin: 0px auto; display: none;" align="center"><table cellpadding="0" cellspacing="0" frame="void" rules="none" style="height:148px;width:160px;text-align:center;"><tbody><tr><td><div id="home_error_info" style="margin-top:72px;" onclick="EMUI.homeStatusDetectController.jumpToPage();"></div></td></tr><tr><td style="height:25px;"><div id="home_connect_failed_type" class="home_connect_fail"></div></td></tr></tbody></table></div></div><div class="pull-left"><a href="#deviceinformation" target="_self" rel="noopener noreferrer"><div id="battery_device_block" class="hide pointer" style="padding-top:45px;position:relative"><div id="home_battery_status" class="hide" style="padding-top:8px;"><div id="home_battery_low" class="hide battery_low" style="margin-top:8px;padding-top:3px;">&nbsp;</div><div id="home_battery_normal" class="hide battery_normal" align="left" style="margin-top:8px;direction:ltr !important;"><div id="home_battery_dynamic_back" class="home_battery_dynamic_back"></div></div><div id="home_battery_charge" class="hide battery_charge" style="margin-top:8px;padding-top:3px;">&nbsp;</div></div><div class="color_home_gray" id="home_battery_number" style="position:absolute;top:105px;left:80px;font-size:12px"></div></div><div id="no_battery_device_block" class="hide home_router pointer" style="position: relative; z-index: 2; display: block;"></div></a><div id="home_device_name" lang-id="home_myDevice" style="margin-top:5px;width:78px;">My device</div></div><div id="home_dual_wifi" class="pull-left" align="center" style="font-size:14px;margin:0 auto;width:240px;"><table cellpadding="0" cellspacing="0" frame="void" rules="none" style="height:148px;"><tbody><tr><td><table cellpadding="0" cellspacing="0" frame="void" rules="none" class="pointer" style="margin-top:72px;" align="center" onclick="EMUI.homeStatusDetectController.iconClickWifi();"><tbody><tr id="home_wifi2_satus" class="hide" style="display: table-row;"><td><a href="#wifieasy" target="_self" rel="noopener noreferrer"><div id="home_wifi2_status_icon" class="home_wifisingle">&nbsp;</div></a></td><td><a href="#wifieasy" target="_self" rel="noopener noreferrer"><div id="home_wifi_24g" class="home_icon_text_split pointer selectmenu" lang-id="wps_wifi_mode_24G">2.4 GHz</div></a></td></tr><tr id="home_wifi5_satus" class="hide" style="display: none;"><td><a href="#wifieasy" target="_self" rel="noopener noreferrer"><div id="home_wifi5_status_icon" class="home_wifisingle">&nbsp;</div></a></td><td><a href="#wifieasy" target="_self" rel="noopener noreferrer"><div id="home_wifi_5g" class="home_icon_text_split pointer" lang-id="wps_wifi_mode_5G">5 GHz</div></a></td></tr></tbody></table></td></tr><tr><td style="height:25px;"><div id="home_wlan_connect_status" class="home_connect_fail"></div></td></tr></tbody></table></div><div id="home_dual_device" class="pull-left" style="margin-top: 40px;"><div class="home_desktop pointer" style="position: relative;z-index: 2;" onclick="EMUI.homeStatusDetectController.iconClickDevice();"><div class="clearboth" align="center" style="margin-top:23px;"><table cellpadding="0" cellspacing="0" frame="void" rules="none" style="max-width:120px; text-align:center;direction: ltr;"><tbody><tr><td><a href="#devicemanagement" target="_self" rel="noopener noreferrer"><div class="selectmenu" style="font-size:36px;" id="home_device_active_count">1</div></a></td><td style="width:21px;"></td></tr></tbody></table></div></div><div style="margin-top:5px;" class="wordbreak" lang-id="menu.devicemanagement">Devices</div></div></div><div class="clearboth">&nbsp;</div></div><div style="height:10px;">&nbsp;</div><table style="width: 100%; border-collapse: collapse;" border="0" cellspacing="20px"><tbody><tr><td style="width: 25%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 37.5%;" colspan="2">&nbsp;<strong>Connection</strong></td><td style="width: 12.5%;">&nbsp;</td><td style="width: 50%;" colspan="2"><strong>&nbsp;Lock Band</strong></td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;WAN IPv4</td><td style="width: 12.5%;" colspan="2">&nbsp;:&nbsp;<span id="WanIPAddress">---</span></td><td style="width: 25%;">&nbsp;<input id="band_auto" type="checkbox" value="AUTO" />&nbsp;Auto</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;WAN DNS</td><td style="width: 12.5%;" colspan="2">&nbsp;:&nbsp;<span id="wan_dns_address">---</span></td><td style="width: 25%;">&nbsp;<input id="band_1" type="checkbox" value="1" />&nbsp;Band 1</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;BAND</td><td style="width: 12.5%;" colspan="2">&nbsp;:&nbsp;<span id="band">---</span></td><td style="width: 25%;">&nbsp;<input id="band_3" type="checkbox" value="3" />&nbsp;Band 3</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;BAND Setting</td><td style="width: 12.5%;" colspan="2">&nbsp;:&nbsp;<span id="allowed">---</span></td><td style="width: 25%;">&nbsp;<input id="band_8" type="checkbox" value="8" />&nbsp;Band 8</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 25%;">&nbsp;<input id="band_40" type="checkbox" value="40" />&nbsp;Band 40</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 25%;">&nbsp;<button id="btn_set" style="color: red;" onclick="set_band()">Apply</button></td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;RSRP</td><td style="width: 12.5%;">&nbsp;:&nbsp;<span id="rsrp">---</span></td><td style="width: 12.5%;" colspan="3">&nbsp;<span id="pr_rsrp">-</span></td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;RSSI</td><td style="width: 12.5%;">&nbsp;:&nbsp;<span id="rssi">---</span></td><td style="width: 12.5%;" colspan="3">&nbsp;<span id="pr_rssi">-</span></td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;RSSQ</td><td style="width: 12.5%;">&nbsp;:&nbsp;<span id="rsrq">---</span></td><td style="width: 12.5%;" colspan="3">&nbsp;<span id="pr_rsrq">-</span></td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;SINR</td><td style="width: 12.5%;">&nbsp;:&nbsp;<span id="sinr">---</span></td><td style="width: 12.5%;" colspan="3">&nbsp;<span id="pr_sinr">-</span></td></tr><tr><td style="width: 25%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;CELL ID</td><td style="width: 12.5%;" colspan="2">&nbsp;:&nbsp;<span id="cell_id">---</span></td><td style="width: 25%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;PCI</td><td style="width: 12.5%;" colspan="2">&nbsp;:&nbsp;<span id="pci">---</span></td><td style="width: 25%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;PCI Nearby</td><td style="width: 12.5%;" colspan="2"><span id="nei_cellid">---</span></td><td style="width: 25%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%; height: 25px;">&nbsp;Wireless transmit</td><td style="width: 12.5%;" colspan="2"><span id="txpower">---</span></td><td style="width: 25%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td></tr><tr><td style="width: 25%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 12.5%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td><td style="width: 25%;">&nbsp;</td></tr></tbody></table><div class="clearboth">&nbsp;</div>';}window.setInterval(refreshData, 1000);
