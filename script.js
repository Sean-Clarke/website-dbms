tables = [];

function Table(name) {
    this.name = name.replace(" ", "-").toLowerCase();
    this.rows = [{}];
    this.cols = 0;
    this.filters = [];
    this.size = 10;
    this.page = 0;
    tables.push(this);
    this.add_col = function (hdr, dflt='-') {
        if (hdr === undefined) {
            hdr = 'C'.concat(this.cols.toString());
        }
        for (i = 0; i < this.cols; i++) {
            if (hdr == this.rows[0][i]) {
                hdr = hdr.concat('*');
                i = -1;
            }
        }
        this.rows[0][this.cols] = hdr;
        for (i = 1; i < this.rows.length; i++) {
            this.rows[i][hdr] = dflt;
        }
        this.cols += 1;
    }
    this.add_row = function (v, index=-1, replace=false) {
        nr = {};
        for (var hdr in this.rows[0]) {
            nr[this.rows[0][hdr]] = v[hdr];
        }
        if (index == -1) {
            this.rows.push(nr);
        } else {
            if (replace == false) {
                this.rows.splice(index, 0, nr);
            } else {
                this.rows.splice(index, 1, nr);
            }
        }
    }
    this.rmv_col = function (hdr) {
        var found = false;
        for (key in this.rows[0]) {
            if (found) {
                this.rows[0][key - 1] = this.rows[0][key];
                continue;
            }
            if (this.rows[0][key] == hdr) {
                found = true;
            }
        }
        if (found) {
            this.cols -= 1;
            delete this.rows[0][this.cols];
            for (i = 1; i < this.rows.length; i++) {
                delete this.rows[i][hdr];
            }
        }
    }
    this.rmv_row = function (r) {
        this.rows.splice(r, 1);
    }
    this.sort = function (hdr) {
        // pass
    }
    this.add_filter = function (filter_string) {
        // pass
    }
}

function newTablePopup() {
    var new_table_button = document.getElementById('new-table-button');
    var popups_container = document.getElementById('popups-container');
    var popup = document.createElement('div');
    popup.setAttribute('id', 'nt-popup');
    var popup_escape = document.createElement('button');
    popup_escape.setAttribute('class', 'popup-escape');
    popup_escape.setAttribute('onclick', 'removePopup("nt");');
    var popup_header = document.createElement('div');
    popup_header.setAttribute('class', 'nt-popup-header');
    var tname = name.replace('-', ' ');
    tname = tname.replace(/\w\S*/g, c => c.charAt(0).toUpperCase() + c.substr(1).toLowerCase());
    popup_header.innerHTML = 'Add New Table'
    var popup_body = document.createElement('div');
    popup_body.setAttribute('class', 'nt-popup-body');
    var popup_table_editor_container = document.createElement('div');
    popup_table_editor_container.id = 'nt-popup-table-editor-container';
    var popup_radio_load = document.createElement('input');
    popup_radio_load.setAttribute('id', 'nt-popup-body-radio-load');
    popup_radio_load.setAttribute('type', 'radio');
    popup_radio_load.setAttribute('name', 'new-table');
    popup_radio_load.setAttribute('onclick', 'getElementById("nt-popup-add-table").disabled=true; getElementById("nt-popup-file-label").style.display="inline-block"; getElementById("nt-popup-load-notice").style.display="block"; getElementById("nt-popup-table-editor-counters").style.display="none";');
    popup_radio_load.checked = true;
    var popup_radio_load_text = document.createElement('span');
    popup_radio_load_text.setAttribute('class', 'nt-popup-body-radio-load-text');
    popup_radio_load_text.innerHTML = 'Load from file';
    var popup_radio_empty = document.createElement('input');
    popup_radio_empty.setAttribute('id', 'nt-popup-body-radio-empty');
    popup_radio_empty.setAttribute('type', 'radio');
    popup_radio_empty.setAttribute('name', 'new-table');
    popup_radio_empty.setAttribute('onclick', 'getElementById("nt-popup-add-table").disabled=false; getElementById("nt-popup-file-label").style.display="none"; getElementById("nt-popup-load-notice").style.display="none"; getElementById("nt-popup-table-editor-counters").style.display="block";');
    var popup_radio_empty_text = document.createElement('span');
    popup_radio_empty_text.setAttribute('class', 'nt-popup-body-radio-load-text');
    popup_radio_empty_text.innerHTML = 'Empty table';
    var popup_file_notice = document.createElement('p');
    popup_file_notice.id = 'nt-popup-load-notice';
    popup_file_notice.className = 'nt-popup-body-p';
    popup_file_notice.innerHTML = 'Note: Currently supported file types to load from are limited to .json and .csv';
    var popup_file_input_label = document.createElement('label');
    popup_file_input_label.id = 'nt-popup-file-label';
    popup_file_input_label.setAttribute ('for', 'nt-popup-file');
    popup_file_input_label.innerHTML = 'Upload Data';
    var popup_file_input = document.createElement('input');
    popup_file_input.id = 'nt-popup-file';
    popup_file_input.type = 'file';
    popup_file_input.accept = '.json,.csv';
    popup_file_input.addEventListener('change', function(e) {
        popup_radio_empty.disabled = true;
        var popup_load_loader = document.createElement('div');
        popup_load_loader.id = 'nt-popup-load-loader';
        popup_table_editor_container.appendChild(popup_load_loader);
        var file = popup_file_input.files[0];
        var csvReader = new FileReader();
        csvReader.onload = function(e) {
            var ldata = csvReader.result.split(/\r?\n|\r/);
            var rows = []
            for (ld = 0; ld < ldata.length; ld++) {
                if (/\S/.test(ldata[ld])) { 
                    rows.push(ldata[ld]);
                }
            }
            popup_radio_load.style.display = 'none';
            popup_radio_load_text.style.display = 'none';
            popup_radio_empty.style.display = 'none';
            popup_radio_empty_text.style.display = 'none';
            popup_file_notice.style.display = 'none';
            popup_file_input_label.style.display = 'none';
            popup_load_loader.style.display = 'none';
            document.getElementById("nt-popup-add-table").disabled=false;
            
            var popup_table_editor_header_switch_label = document.createElement('label');
            popup_table_editor_header_switch_label.id = 'nt-popup-table-editor-header-switch-container';
            popup_table_editor_header_switch_label.innerHTML = 'Header Row in File';
            var popup_table_editor_header_switch = document.createElement('input');
            popup_table_editor_header_switch.id = 'nt-popup-table-editor-header-switch';
            popup_table_editor_header_switch.type = 'checkbox';
            popup_table_editor_header_switch.checked = true;
            var popup_table_editor_header_entry_container = document.createElement('div');
            popup_table_editor_header_entry_container.id = 'nt-popup-table-editor-header-entry-container';
            popup_table_editor_header_entry_container.style.display = 'none';
            var template_row = rows[0].split(/,[' ']*/);
            for (hi = 0; hi < template_row.length; hi++) {
                var popup_table_editor_header_entry = document.createElement('div');
                popup_table_editor_header_entry.setAttribute('class', 'nt-popup-table-editor-header-entry');
                popup_table_editor_header_entry.innerHTML = 'C'.concat(hi.toString());
                popup_table_editor_header_entry.contentEditable = 'true';
                popup_table_editor_header_entry.addEventListener('keypress', function(e) { if (e.keyCode === 13) { e.preventDefault();} else if (e.keyCode === 44) { e.preventDefault();} });
                popup_table_editor_header_entry_container.appendChild(popup_table_editor_header_entry);
            }
            popup_table_editor_header_switch.onchange = function() {
                if (popup_table_editor_header_switch.checked == false) {
                    popup_table_editor_header_entry_container.style.display = 'block';
                    popup_table_editor_header_entry_container.scrollTop = popup_table_editor_header_entry_container.scrollHeight;
                }
                else {
                    popup_table_editor_header_entry_container.style.display = 'none';
                }
            }
            var popup_table_editor_header_switch_mark = document.createElement('span');
            popup_table_editor_header_switch_mark.id = 'nt-popup-table-editor-header-switch-checkmark';
            var popup_table_editor_preview = document.createElement('div');
            popup_table_editor_preview.id = 'nt-popup-table-editor-preview';
            popup_table_editor_header_switch_label.appendChild(popup_table_editor_header_switch);
            popup_table_editor_header_switch_label.appendChild(popup_table_editor_header_switch_mark);
            popup_table_editor_container.appendChild(popup_table_editor_header_switch_label);
            popup_table_editor_container.appendChild(popup_table_editor_header_entry_container);
            popup_table_editor_container.appendChild(popup_table_editor_preview);
            popup_continue.onclick = function() {
                var tname = document.querySelector('input[id="nt-popup-table-name-input"]').value;
                if (tname == '') {
                    tname = 'table'.concat(tables.length.toString());
                }
                if (popup_table_editor_header_switch.checked == false) {
                    var new_headers_str = popup_table_editor_header_entry_container.childNodes[0].textContent;
                    for (hi = i; hi < popup_table_editor_header_entry_container.childElementCount; hi ++) {
                        new_headers_str = new_headers_str.concat(',');
                        new_headers_str = new_headers_str.concat(popup_table_editor_header_entry_container.childNodes[hi].textContent);
                    }
                    rows.unshift(new_headers_str);
                }
                tfl = new Table(tname);
                var hdrs = rows[0].split(/,[' ']*/);
                for (hdr = 0; hdr < hdrs.length; hdr++) {
                    tfl.add_col(hdrs[hdr]);
                }
                for (ri = 1; ri < rows.length; ri++) {
                    var cells = rows[ri].split(/,[' ']*/);
                    tfl.add_row(cells);
                }
                addTable(tfl);
                removePopup('nt');
            }
        }
        csvReader.readAsText(file);
    });
    var popup_table_editor_counters = document.createElement('div');
    popup_table_editor_counters.id = 'nt-popup-table-editor-counters';
    var popup_table_editor_column_counter = document.createElement('div');
    popup_table_editor_column_counter.id = 'nt-popup-table-editor-column-counter';
    var popup_table_editor_column_counter_title = document.createElement('p');
    popup_table_editor_column_counter_title.id = 'nt-popup-table-editor-column-counter-title';
    popup_table_editor_column_counter_title.innerHTML = 'Number of Starting Columns';
    var popup_table_editor_column_counter_decrement = document.createElement('button');
    popup_table_editor_column_counter_decrement.id = 'nt-popup-table-editor-column-counter-dec-button';
    popup_table_editor_column_counter_decrement.innerHTML = '-';
    popup_table_editor_column_counter_decrement.setAttribute('onclick', 'getElementById("nt-popup-table-editor-column-counter-value").stepDown()');
    var popup_table_editor_column_counter_value = document.createElement('input');
    popup_table_editor_column_counter_value.id = 'nt-popup-table-editor-column-counter-value';
    popup_table_editor_column_counter_value.type = 'number';
    popup_table_editor_column_counter_value.min = '0';
    popup_table_editor_column_counter_value.readOnly = 'true';
    popup_table_editor_column_counter_value.defaultValue = '0';
    var popup_table_editor_column_counter_increment = document.createElement('button');
    popup_table_editor_column_counter_increment.id = 'nt-popup-table-editor-column-counter-inc-button';
    popup_table_editor_column_counter_increment.innerHTML = '+';
    popup_table_editor_column_counter_increment.setAttribute('onclick', 'getElementById("nt-popup-table-editor-column-counter-value").stepUp()');
    popup_table_editor_column_counter.appendChild(popup_table_editor_column_counter_title);
    popup_table_editor_column_counter.appendChild(popup_table_editor_column_counter_decrement);
    popup_table_editor_column_counter.appendChild(popup_table_editor_column_counter_value);
    popup_table_editor_column_counter.appendChild(popup_table_editor_column_counter_increment);
    popup_table_editor_counters.appendChild(popup_table_editor_column_counter);
    var popup_table_name_text = document.createElement('p');
    popup_table_name_text.id = 'nt-popup-table-name-text';
    popup_table_name_text.innerHTML = 'Table Name';
    var popup_table_name = document.createElement('input');
    popup_table_name.id = 'nt-popup-table-name-input';
    popup_table_name.type = 'text';
    var popup_table_name_example = document.createElement('p');
    popup_table_name_example.id = 'nt-popup-table-name-example';
    popup_table_name_example.innerHTML = "eg. employee-table, animal-kingdom, marathons-2018";
    popup_table_editor_container.appendChild(popup_radio_load);
    popup_table_editor_container.appendChild(popup_radio_load_text);
    popup_table_editor_container.appendChild(popup_radio_empty);
    popup_table_editor_container.appendChild(popup_radio_empty_text);
    popup_table_editor_container.appendChild(popup_file_notice);
    popup_table_editor_container.appendChild(popup_file_input_label);
    popup_table_editor_container.appendChild(popup_table_editor_counters);
    popup_table_editor_container.appendChild(popup_file_input);
    popup_body.appendChild(popup_table_editor_container);
    popup_body.appendChild(popup_table_name_text);
    popup_body.appendChild(popup_table_name);
    popup_body.appendChild(popup_table_name_example);
    var popup_footer = document.createElement('div');
    popup_footer.setAttribute('class', 'nt-popup-footer');
    var popup_continue = document.createElement('button');
    popup_continue.innerHTML = 'Add Table';
    popup_continue.setAttribute('id', 'nt-popup-add-table');
    popup_continue.setAttribute('class', 'nt-popup-continue');
    popup_continue.setAttribute('type', 'button');
    popup_continue.setAttribute('disabled', 'true');
    popup_continue.setAttribute('onclick', 'addNewTable();');
    var popup_cancel = document.createElement('button');
    popup_cancel.setAttribute('class', 'nt-popup-cancel');
    popup_cancel.innerHTML = 'Cancel';
    popup_cancel.setAttribute('onclick', 'removePopup("nt");');
    popup_footer.appendChild(popup_continue);
    popup_footer.appendChild(popup_cancel);
    popup.appendChild(popup_escape);
    popup.appendChild(popup_header);
    popup.appendChild(popup_body);
    popup.appendChild(popup_footer);
    popups_container.appendChild(popup);
    new_table_button.style.display = 'none';
    popups_container.style.display = 'block';
}

function deleteTablePopup(name) {
    var new_table_button = document.getElementById('new-table-button');
    var popups_container = document.getElementById('popups-container');
    var popup = document.createElement('div');
    popup.setAttribute('id', 'dt-popup');
    var popup_escape = document.createElement('button');
    popup_escape.setAttribute('class', 'popup-escape');
    popup_escape.setAttribute('onclick', 'removePopup("dt");');
    var popup_header = document.createElement('div');
    popup_header.setAttribute('class', 'dt-popup-header');
    var tname = name.replace('-', ' ');
    tname = tname.replace(/\w\S*/g, c => c.charAt(0).toUpperCase() + c.substr(1).toLowerCase());
    popup_header.innerHTML = 'Delete '.concat(tname).concat('?');
    var popup_body = document.createElement('div');
    popup_body.setAttribute('class', 'dt-popup-body');
    popup_body.innerHTML = 'Are you sure you want to delete this table? All data inside the table will be lost.';
    var popup_options = document.createElement('div');
    popup_options.setAttribute('class', 'dt-popup-options');
    var popup_continue = document.createElement('button');
    popup_continue.innerHTML = 'Proceed';
    popup_continue.setAttribute('class', 'dt-popup-continue');
    popup_continue.setAttribute('onclick', 'removeTable("'.concat(name).concat('");'));
    var popup_cancel = document.createElement('button');
    popup_cancel.setAttribute('class', 'dt-popup-cancel');
    popup_cancel.innerHTML = 'Cancel';
    popup_cancel.setAttribute('onclick', 'removePopup("dt");');
    popup_options.appendChild(popup_continue);
    popup_options.appendChild(popup_cancel);
    popup.appendChild(popup_escape);
    popup.appendChild(popup_header);
    popup.appendChild(popup_body);
    popup.appendChild(popup_options);
    popups_container.appendChild(popup);
    new_table_button.style.display = 'none';
    popups_container.style.display = 'block';
}

function displayColors(o) {
    name = o.id.slice(0, -15);
    var color_selection = document.createElement('div');
    color_selection.setAttribute('id', name.concat('-controls-color-tab'));
    color_selection.setAttribute('class', 'table-controls-color-tab');
    color_selection.style.display = 'grid';
    var color_selection_sky = document.createElement('button');
    color_selection_sky.setAttribute('id', name.concat('-controls-color-button-sky'));
    color_selection_sky.setAttribute('class', 'table-controls-color-button');
    color_selection_sky.setAttribute('onclick', 'changeColors("'.concat(name.concat('", "sky");')));
    color_selection_sky.style.background = 'linear-gradient(to right, #3399DD, #1177DD)';
    var color_selection_sea = document.createElement('button');
    color_selection_sea.setAttribute('id', name.concat('-controls-color-button-sea'));
    color_selection_sea.setAttribute('class', 'table-controls-color-button');
    color_selection_sea.setAttribute('onclick', 'changeColors("'.concat(name.concat('", "sea");')));
    color_selection_sea.style.background = 'linear-gradient(to right, #00BBA0, #00ABC0)';
    var color_selection_jungle = document.createElement('button');
    color_selection_jungle.setAttribute('id', name.concat('-controls-color-button-jungle'));
    color_selection_jungle.setAttribute('class', 'table-controls-color-button');
    color_selection_jungle.setAttribute('onclick', 'changeColors("'.concat(name.concat('", "jungle");')));
    color_selection_jungle.style.background = 'linear-gradient(to right, #77BB77, #448844)';
    var color_selection_ocean = document.createElement('button');
    color_selection_ocean.setAttribute('id', name.concat('-controls-color-button-ocean'));
    color_selection_ocean.setAttribute('class', 'table-controls-color-button');
    color_selection_ocean.setAttribute('onclick', 'changeColors("'.concat(name.concat('", "ocean");')));
    color_selection_ocean.style.background = 'linear-gradient(to right, #1060A0, #005070)';
    var color_selection_sunset = document.createElement('button');
    color_selection_sunset.setAttribute('id', name.concat('-controls-color-button-sunset'));
    color_selection_sunset.setAttribute('class', 'table-controls-color-button');
    color_selection_sunset.setAttribute('onclick', 'changeColors("'.concat(name.concat('", "sunset");')));
    color_selection_sunset.style.background = 'linear-gradient(to right, #FF5540, #EE3340)';
    var color_selection_berry = document.createElement('button');
    color_selection_berry.setAttribute('id', name.concat('-controls-color-button-berry'));
    color_selection_berry.setAttribute('class', 'table-controls-color-button');
    color_selection_berry.setAttribute('onclick', 'changeColors("'.concat(name.concat('", "berry");')));
    color_selection_berry.style.background = 'linear-gradient(to right, #CC2288, #441188)';
    var color_selection_night = document.createElement('button');
    color_selection_night.setAttribute('class', 'table-controls-color-button');
    color_selection_night.setAttribute('onclick', 'changeColors("'.concat(name.concat('", "night");')));
    color_selection_night.style.background = 'linear-gradient(to right, #445566, #223344)';
    var color_selection_marble = document.createElement('button');
    color_selection_night.setAttribute('id', name.concat('-controls-color-button-night'));
    color_selection_marble.setAttribute('id', name.concat('-controls-color-button-marble'));
    color_selection_marble.setAttribute('class', 'table-controls-color-button');
    color_selection_marble.setAttribute('onclick', 'changeColors("'.concat(name.concat('", "marble");')));
    color_selection_marble.style.background = 'linear-gradient(to right, white, #DDDDDD)';
    color_selection.appendChild(color_selection_sky);
    color_selection.appendChild(color_selection_sea);
    color_selection.appendChild(color_selection_jungle);
    color_selection.appendChild(color_selection_ocean);
    color_selection.appendChild(color_selection_sunset);
    color_selection.appendChild(color_selection_berry);
    color_selection.appendChild(color_selection_night);
    color_selection.appendChild(color_selection_marble);
    o.appendChild(color_selection);
}

function hideColors() {
    var color_selections = document.getElementsByClassName('table-controls-color-tab');
    for (var c_select in color_selections) {
        color_selections[c_select].parentNode.removeChild(color_selections[c_select]);
        return
    }
}

function changeColors(name, str) {
    // set col palletes:    lt       dk      aux-pri    aux-sec    sec-lt     sec-dk
    var cpal_marble = ['#E0E0E0', '#C9C9C9', '#EFEFEF', 'white', '#D9D9D9', '#C5C5C5'];
    var cpal_sunset = ['#FF5540', '#EE3340', '#F09030', '#F0A030', '#FF7060', '#EE5050'];
    var cpal_berry = ['#BB2288', '#441188', '#CC20CC', '#DD30DD', '#CC4499', '#4433AA'];
    var cpal_sky = ['#3399DD', '#1177DD', '#0575C5', '#0065C0', '#44AAFF', '#2288EE'];
    var cpal_ocean = ['#1060A0', '#005070', '#0090CC', '#00A0E0', '#1080C0', '#007090'];
    var cpal_sea = ['#00BBA0', '#00ABC0', '#009BA0', '#009090', '#22D0BB', '#00BBEE'];
    var cpal_jungle = ['#66BB66', '#448844', '#228822', '#117711', '#88CC88', '#509950'];
    var cpal_night = ['#445566', '#223344', '#7090B0', '#80A0C0', '#607585', '#324354'];
    document.documentElement.style.setProperty('--'.concat(name.concat('-text-color')), 'white');
    switch(str) {
        case 'night':
            c_pal = cpal_night;
            break;
        case 'ocean':
            c_pal = cpal_ocean;
            break;
        case 'sky':
            c_pal = cpal_sky;
            break;
        case 'berry':
            c_pal = cpal_berry;
            break;
        case 'sea':
            c_pal = cpal_sea;
            break;
        case 'sunset':
            c_pal = cpal_sunset;
            break;
        case 'jungle':
            c_pal = cpal_jungle;
            break;
        case 'marble':
            c_pal = cpal_marble;
            document.documentElement.style.setProperty('--'.concat(name.concat('-text-color')), '#555555');
            break;
    }
    document.documentElement.style.setProperty('--'.concat(name.concat('-lt-color')), c_pal[0]);
    document.documentElement.style.setProperty('--'.concat(name.concat('-dk-color')), c_pal[1]);
    document.documentElement.style.setProperty('--'.concat(name.concat('-aux-pri-color')), c_pal[2]);
    document.documentElement.style.setProperty('--'.concat(name.concat('-aux-sec-color')), c_pal[3]);
    document.documentElement.style.setProperty('--'.concat(name.concat('-sec-lt-color')), c_pal[4]);
    document.documentElement.style.setProperty('--'.concat(name.concat('-sec-dk-color')), c_pal[5]);
}

function displayLayouts(o) {
    var layout_selection = document.createElement('div');
    layout_selection.setAttribute('class', 'table-controls-layout-tab');
    o.appendChild(layout_selection);
}

function hideLayouts() {
    var layout_selections = document.getElementsByClassName('table-controls-layout-tab');
    for (var l_select in layout_selections) {
        layout_selections[l_select].parentNode.removeChild(layout_selections[l_select]);
        return;
    }
}

function alternatingRowsLayout(name) {
    var odd_rows = document.getElementsByClassName('table-row-odd');
    for (var i = 0; i < odd_rows.length; i++) {
        odd_rows[i].style.background = 'linear-gradient(to right, var(--table-sec-lt-color), var(--table-sec-dk-color))';
    }
}

function changeRPP(name, num_rows) {
    for (i = 0; i < tables.length; i++) {
        if (tables[i].name == name) {
            tables[i].size = num_rows;
            tables[i].page = 0;
            updateTable(name);
            return;
        }
    }
}

function displayRowsPerPage(name) {
    var rpp_container = document.getElementById(name.concat('-bottom-rpp'));
    rpp_container.removeChild(rpp_container.childNodes[0]);
    var rpp_selection_5 = document.createElement('button');
    rpp_selection_5.setAttribute('class', 'table-bottom-rpp-option');
    rpp_selection_5.setAttribute('onclick', 'changeRPP("'.concat(name).concat('", "5"); hideRowsPerPage("'.concat(name).concat('");')));
    rpp_selection_5.innerHTML = '5';
    rpp_selection_5.style.color = 'thin solid var(--'.concat(name.concat('-text-color)'));
    var rpp_selection_10 = document.createElement('button');
    rpp_selection_10.setAttribute('class', 'table-bottom-rpp-option');
    rpp_selection_10.setAttribute('onclick', 'changeRPP("'.concat(name).concat('", "10"); hideRowsPerPage("'.concat(name).concat('");')));
    rpp_selection_10.innerHTML = '10';
    rpp_selection_10.style.color = 'thin solid var(--'.concat(name.concat('-text-color)'));
    var rpp_selection_25 = document.createElement('button');
    rpp_selection_25.setAttribute('class', 'table-bottom-rpp-option');
    rpp_selection_25.setAttribute('onclick', 'changeRPP("'.concat(name).concat('", "25"); hideRowsPerPage("'.concat(name).concat('");')));
    rpp_selection_25.innerHTML = '25';
    rpp_selection_25.style.color = 'thin solid var(--'.concat(name.concat('-text-color)'));
    var rpp_selection_50 = document.createElement('button');
    rpp_selection_50.setAttribute('class', 'table-bottom-rpp-option');
    rpp_selection_50.setAttribute('onclick', 'changeRPP("'.concat(name).concat('", "50"); hideRowsPerPage("'.concat(name).concat('");')));
    rpp_selection_50.innerHTML = '50';
    rpp_selection_50.style.color = 'thin solid var(--'.concat(name.concat('-text-color)'));
    var rpp_selection_100 = document.createElement('button');
    rpp_selection_100.setAttribute('class', 'table-bottom-rpp-option');
    rpp_selection_100.setAttribute('onclick', 'changeRPP("'.concat(name).concat('", "100"); hideRowsPerPage("'.concat(name).concat('");')));
    rpp_selection_100.innerHTML = '100';
    rpp_selection_100.style.color = 'thin solid var(--'.concat(name.concat('-text-color)'));
    var rpp_selection_500 = document.createElement('button');
    rpp_selection_500.setAttribute('class', 'table-bottom-rpp-option');
    rpp_selection_500.setAttribute('onclick', 'changeRPP("'.concat(name).concat('", "500"); hideRowsPerPage("'.concat(name).concat('");')));
    rpp_selection_500.innerHTML = '500';
    rpp_selection_500.style.color = 'thin solid var(--'.concat(name.concat('-text-color)'));
    var rpp_selection_2000 = document.createElement('button');
    rpp_selection_2000.setAttribute('class', 'table-bottom-rpp-option');
    rpp_selection_2000.setAttribute('onclick', 'changeRPP("'.concat(name).concat('", "2000"); hideRowsPerPage("'.concat(name).concat('");')));
    rpp_selection_2000.innerHTML = '2000';
    rpp_selection_2000.style.color = 'thin solid var(--'.concat(name.concat('-text-color)'));
    rpp_container.appendChild(rpp_selection_5);
    rpp_container.appendChild(rpp_selection_10);
    rpp_container.appendChild(rpp_selection_25);
    rpp_container.appendChild(rpp_selection_50);
    rpp_container.appendChild(rpp_selection_100);
    rpp_container.appendChild(rpp_selection_500);
    rpp_container.appendChild(rpp_selection_2000);
}

function hideRowsPerPage(name) {
    var rows_selections = document.getElementById(name.concat('-bottom-rpp'));
    rows_selections.style.width = '60px';
    for (rtr = 0; rtr < rows_selections.children.length; rtr++) {
        rows_selections.removeChild(rows_selections.childNodes[rtr]);
    }
    for (i = 0; i < tables.length; i++) {
        if (tables[i].name == name) {
            rows_selections.innerHTML = '<p style="margin-top:8px">'.concat(tables[i].size).concat('</p>');
            rows_selections.style.display = 'inline-block';
            return;
        }
    }
}

function updatePageSelect(t) {
    var page_select_container = document.getElementById(t.name.concat('-page-select-container'));
    var pages = Math.ceil((t.rows.length - 1) / t.size);
    if (pages > 1) {
        page_select_container.style.display = 'inline-block';
        if ((t.page < 2) || ((t.page == 2) && (pages == 3))) {
            for (p = 0; p < 3; p++) {
                if (p >= pages) {
                    page_select_container.childNodes[p].style.display = 'none';
                    break;
                }
                page_select_container.childNodes[p].style.display = 'inline-block';
                page_select_container.childNodes[p].innerHTML = p;
                if (p == t.page) {
                    page_select_container.childNodes[p].className = 'table-current-page-select';
                    page_select_container.childNodes[p].disabled = true;
                } else {
                    page_select_container.childNodes[p].className = 'table-page-select';
                    page_select_container.childNodes[p].disabled = false;
                    page_select_container.childNodes[p].setAttribute('onclick', 'changePage("'.concat(t.name).concat('", ').concat(p.toString()).concat(');'));
                }
            }
        } else if (t.page == pages - 1) {
            for (p = t.page - 2; p <= t.page; p++) {
                page_select_container.childNodes[p - t.page + 2].style.display = 'inline-block';
                page_select_container.childNodes[p - t.page + 2].innerHTML = p;
                if (p == t.page) {
                    page_select_container.childNodes[p - t.page + 2].className = 'table-current-page-select';
                    page_select_container.childNodes[p - t.page + 2].disabled = true;
                } else {
                    page_select_container.childNodes[p - t.page + 2].className = 'table-page-select';
                    page_select_container.childNodes[p - t.page + 2].disabled = false;
                    page_select_container.childNodes[p - t.page + 2].setAttribute('onclick', 'changePage("'.concat(t.name).concat('", ').concat(p.toString()).concat(');'));
                }
            }
        } else {
            var pi = -1;
            for (p = t.page - 1; ((p < pages && p <= (t.page + 1))); p++) {
                pi += 1;
                page_select_container.childNodes[pi].style.display = 'inline-block';
                page_select_container.childNodes[pi].innerHTML = p;
                if (p == t.page) {
                    page_select_container.childNodes[pi].className = 'table-current-page-select';
                    page_select_container.childNodes[pi].disabled = true;
                } else {
                    page_select_container.childNodes[pi].className = 'table-page-select';
                    page_select_container.childNodes[pi].disabled = false;
                    page_select_container.childNodes[pi].setAttribute('onclick', 'changePage("'.concat(t.name).concat('", ').concat(p.toString()).concat(');'));
                }
            }
        }
    } else {
        //for (psi = 0; psi < page_select_container.childNodes.length; psi++) {
        //    page_select_container.childNodes[psi].style.display = 'none';
        //}
        page_select_container.style.display = 'none';
    }
}

function buildTable(t) {
    var name = t.name;
    var t_html = document.createElement('table');
    t_html.setAttribute('id', name);
    // Create Table Head
    var thead_html = document.createElement('thead');
    thead_html.id = name.concat('-head');
    var tr_html = document.createElement('tr');
    for (var hdr in t.rows[0]) {
        var th_html = document.createElement('th');
        th_html.setAttribute('id', name.concat('-th-').concat(t.rows[0][hdr].replace(" ", "-").toLowerCase()));
        th_html.setAttribute('class', 'table-th');
        var thc_html = document.createElement('div');
        thc_html.setAttribute('id', name.concat('-hc-').concat(t.rows[0][hdr].replace(" ", "-").toLowerCase()));
        thc_html.setAttribute('class', 'table-thc');
        var header_content = t.rows[0][hdr];
        if (/^[\*]*$/.test(header_content)) {
            header_content = '';
        }
        thc_html.innerHTML = header_content;
        th_html.appendChild(thc_html);
        tr_html.appendChild(th_html);
    }
    var th_html = document.createElement('th');
    th_html.setAttribute('class', 'table-new-column-button-container');
    var new_col_button_html = document.createElement('button');
    new_col_button_html.setAttribute('id', name.concat('-new-column-button'));
    new_col_button_html.setAttribute('class', 'table-new-column-button');
    new_col_button_html.setAttribute('onclick', 'addColumn(this.id.slice(0, -18));')
    th_html.appendChild(new_col_button_html);
    tr_html.appendChild(th_html);
    thead_html.appendChild(tr_html);
    t_html.appendChild(thead_html);
    // Create Table Foot
    var tfoot_html = document.createElement('tfoot');
    tfoot_html.id = name.concat('-foot');
    var tr_html = document.createElement('tr');
    //for (i = 0; i < t.cols; i++) {
    //    var td_html = document.createElement('td');
    //    td_html.setAttribute('id', name.concat('-footer-td-').concat(i.toString()));
    //    td_html.setAttribute('class', 'table-footer-td');
    //    tr_html.appendChild(td_html);
    //}
    var td_html = document.createElement('td');
    td_html.setAttribute('class', 'table-new-row-button-container');
    td_html.style.borderTop = 'thin solid var(--'.concat(name.concat('-aux-pri-color)'));
    td_html.setAttribute('colspan', t.cols + 1);
    var t_nr_button = document.createElement('button');
    t_nr_button.setAttribute('id', name.concat('-new-row-button'));
    t_nr_button.setAttribute('class', 'table-new-row-button');
    t_nr_button.innerHTML = 'Add New Row';
    t_nr_button.setAttribute('onclick', 'newRowEdit("'.concat(name).concat('");'));
    td_html.appendChild(t_nr_button);
    tr_html.appendChild(td_html);
    tfoot_html.appendChild(tr_html);
    t_html.appendChild(tfoot_html);
    // Create Table Body
    var tbody_html = document.createElement('tbody');
    tbody_html.id = name.concat('-body');
    for (i = (1 + (t.size * t.page)); i < (1 + (t.size * (t.page + 1))); i++) {
        if (i == t.rows.length) {
            break;
        }
        var tr_html = document.createElement('tr');
        if (i % 2 == 1) {
            tr_html.className += 'table-row-odd'
        }
        for (var cell in t.rows[0]) {
            cell = t.rows[0][cell];
            var td_html = document.createElement('td');
            td_html.setAttribute('class', 'table-data');
            td_html.style.borderTop = 'thin solid var(--'.concat(name.concat('-aux-pri-color)'));
            var tc_html = document.createElement('div');
            tc_html.setAttribute('id', name.concat('-cell-').concat(i.toString()).concat('-').concat(cell.toString().toLowerCase()));
            tc_html.setAttribute('class', 'table-cell');
            tc_html.innerHTML = t.rows[i][cell];
            td_html.appendChild(tc_html);
            tr_html.appendChild(td_html);
        }
        var tr_actions_html = document.createElement('td');
        tr_actions_html.setAttribute('class', 'table-row-actions');
        tr_actions_html.style.borderTop = 'thin solid var(--'.concat(name.concat('-aux-pri-color)'));
        var tr_actions_button_html = document.createElement('button');
        tr_actions_button_html.setAttribute('id', name.concat('-row-').concat(i.toString()).concat('-actions-button'));
        tr_actions_button_html.setAttribute('class', 'table-row-actions-button');
        tr_actions_button_html.setAttribute('onclick', 'removeRow(this.id.split("-row-")[0], '.concat(i).concat(');'));
        tr_actions_html.appendChild(tr_actions_button_html);
        tr_html.appendChild(tr_actions_html);
        tbody_html.appendChild(tr_html);
    }
    t_html.appendChild(tbody_html);
    return t_html;
}

function addTable(t) {
    var tables_container = document.getElementById('tables-container');
    // Create Table Container
    name = t.name;
    var t_container = document.createElement('div');
    t_container.setAttribute('id', name.concat('-container'));
    t_container.setAttribute('class', 'table-container');
    document.documentElement.style.setProperty('--'.concat(name.concat('-lt-color')), '#445566');
    document.documentElement.style.setProperty('--'.concat(name.concat('-dk-color')), '#223344');
    document.documentElement.style.setProperty('--'.concat(name.concat('-aux-pri-color')), '#7090B0');
    document.documentElement.style.setProperty('--'.concat(name.concat('-aux-sec-color')), '#80A0C0');
    document.documentElement.style.setProperty('--'.concat(name.concat('-sec-lt-color')), '#607585');
    document.documentElement.style.setProperty('--'.concat(name.concat('-sec-dk-color')), '#324354');
    document.documentElement.style.setProperty('--'.concat(name.concat('-text-color')), 'white');
    t_container.style.color = 'var(--'.concat(name.concat('-text-color)'));
    t_container.style.background = 'linear-gradient(to right, var(--'.concat(name.concat('-lt-color), var(--'.concat(name.concat('-dk-color))'))));
    
    // Create Table Top
    var t_top = document.createElement('div');
    t_top.setAttribute("id", name.concat('-controls'));
    t_top.setAttribute("class", 'table-controls');
    var t_top_search = document.createElement('form');
    t_top_search.setAttribute("id", name.concat('-controls-search'));
    t_top_search.setAttribute('class', 'table-controls-search');
    t_top_search.setAttribute('action', 'javascript:void(0);');
    t_top_search.setAttribute('onsubmit', 'addSelection();');
    var t_top_search_input = document.createElement('input');
    t_top_search_input.setAttribute('id', name.concat('-controls-search-input'));
    t_top_search_input.setAttribute('class', 'table-controls-search-input');
    t_top_search_input.setAttribute('type', 'text');
    t_top_search_input.setAttribute('autocomplete', 'off');
    t_top_search_input.setAttribute('placeholder', 'Search...');
    t_top_search.appendChild(t_top_search_input);
    var t_top_color = document.createElement('div');
    t_top_color.setAttribute('id', name.concat('-controls-color'));
    t_top_color.setAttribute('class', 'table-controls-color');
    t_top_color.setAttribute('onmouseenter', 'displayColors(this);');
    t_top_color.setAttribute('onmouseleave', 'hideColors();');
    var t_top_layout = document.createElement('div');
    t_top_layout.setAttribute('id', name.concat('-controls-layout'));
    t_top_layout.setAttribute('class', 'table-controls-layout');
    t_top_layout.setAttribute('onmouseenter', 'displayLayouts(this);');
    t_top_layout.setAttribute('onmouseleave', 'hideLayouts();');
    var t_top_edit = document.createElement('button');
    t_top_edit.setAttribute('id', name.concat('-controls-edit'));
    t_top_edit.setAttribute('class', 'table-controls-edit');
    t_top_edit.setAttribute('onclick', 'editMode(this.id.slice(0, -14))');
    var t_top_delete = document.createElement('button');
    t_top_delete.setAttribute('id', name.concat('-controls-delete'));
    t_top_delete.setAttribute('class', 'table-controls-delete');
    t_top_delete.setAttribute('onclick', 'deleteTablePopup(this.id.slice(0, -16));');
    t_top.appendChild(t_top_delete);
    t_top.appendChild(t_top_edit);
    t_top.appendChild(t_top_layout);
    t_top.appendChild(t_top_color);
    t_top.appendChild(t_top_search);

    // Create Table Bottom
    var t_bottom = document.createElement('div');
    t_bottom.setAttribute('id', name.concat('-nav'));
    t_bottom.setAttribute('class', 'table-nav');
    var t_bottom_rpp = document.createElement('div');
    t_bottom_rpp.setAttribute('id', name.concat('-bottom-rpp'));
    t_bottom_rpp.setAttribute('class', 'table-rpp');
    t_bottom_rpp.innerHTML = '<p style="margin-top:8px">'.concat(t.size).concat('</p>');
    t_bottom_rpp.setAttribute('onclick', 'document.getElementById("'.concat(t_bottom_rpp.id).concat('").style.width = "420px"; displayRowsPerPage("').concat(name).concat('");'));
    t_bottom_rpp.setAttribute('onmouseleave', 'hideRowsPerPage("'.concat(name).concat('");'));
    var t_page_select_container = document.createElement('div');
    t_page_select_container.setAttribute('class', 'table-page-select-container');
    t_page_select_container.setAttribute('id', name.concat('-page-select-container'));
    t_page_select_container.style.display = 'none';
    var t_page_select_first = document.createElement('button');
    t_page_select_first.setAttribute('class', 'table-page-select');
    t_page_select_first.style.color = 'thin solid var(--'.concat(name.concat('-text-color)'));
    var t_page_select_second = document.createElement('button');
    t_page_select_second.setAttribute('class', 'table-page-select');
    t_page_select_second.style.color = 'thin solid var(--'.concat(name.concat('-text-color)'));
    var t_page_select_third = document.createElement('button');
    t_page_select_third.setAttribute('class', 'table-page-select');
    t_page_select_third.style.color = 'thin solid var(--'.concat(name.concat('-text-color)'));
    t_page_select_container.appendChild(t_page_select_first);
    t_page_select_container.appendChild(t_page_select_second);
    t_page_select_container.appendChild(t_page_select_third);
    t_bottom.appendChild(t_bottom_rpp);
    t_bottom.appendChild(t_page_select_container);
    t_container.appendChild(t_top);
    t_container.appendChild(buildTable(t));
    t_container.appendChild(t_bottom);
    tables_container.appendChild(t_container);
    if ((t.rows.length - 1) > t.size) {
        updatePageSelect(t);
    }
}

function updateTable(name) {
    var table_container = document.getElementById(name.concat('-container'));
    var table = document.getElementById(name);
    document.getElementById(name.concat('-controls-edit')).disabled = false;
    table_container.removeChild(table);
    for (i = 0; i < tables.length; i++) {
        if (tables[i].name == name) {
            updatePageSelect(tables[i]);		
            table_container.insertBefore(buildTable(tables[i]), table_container.children[1]);
            return;
        }
    }
}

function removePopup(type) {
    var popups_container = document.getElementById('popups-container');
    var popup = document.getElementById(type.concat('-popup'));
    var new_table_button = document.getElementById('new-table-button');
    popups_container.removeChild(popup);
    popups_container.style.display = 'none';
    new_table_button.style.display = 'block';
}

function removeTable(name) {
    var tables_container = document.getElementById('tables-container');
    var table_container = document.getElementById(name.concat('-container'));
    tables_container.removeChild(table_container);
    for (i = 0; i < tables.length; i++) {
        if (tables[i].name == name) {
            delete tables[i];
            tables.splice(i, 1);
            break;
        }
    }
    removePopup('dt');
}

function addColumn(name) {
    for (i = 0; i < tables.length; i++) {
        if (tables[i].name == name) {
            tables[i].add_col();
            updateTable(name);
            return;
        }
    }
}

function removeRow(name, row) {
    for (i = 0; i < tables.length; i++) {
        if (tables[i].name == name) {
            tables[i].rmv_row(row);
            if (Math.ceil((tables[i].rows.length - 1) / tables[i].size) < tables[i].page + 1 && tables[i].page != 0) {
                tables[i].page -= 1;
            }	
            updateTable(name);
            return;
        }
    }
}

function changePage(name, page) {
    for (i = 0; i < tables.length; i++) {
        if (tables[i].name == name) {
            tables[i].page = page;
            updateTable(name);
            return;
        }
    }
}

function newRowEdit(name) {
    tbody = document.getElementById(name.concat('-body'));
    new_row_button = document.getElementById(name.concat('-new-row-button'));
    new_row_button_container = new_row_button.parentElement;
    new_row_button.style.display = 'none';
    document.getElementById(name.concat('-controls-edit')).disabled = 'true';
    for (i = 0; i < tables.length; i++) {
        if (tables[i].name == name) {
            trow = document.createElement('tr');
            trow.setAttribute('id', name.concat('-new-tr'));
            for (var hdr in tables[i].rows[0]) {
                tdata = document.createElement('td');
                tdata.style.borderTop = 'thin solid var(--'.concat(name.concat('-aux-pri-color)'));
                tcell = document.createElement('div');
                //tcell = document.createElement('div');
                //tcell.setAttribute('id', name.concat('-cell-').concat(tables[i].rows.length.toString()).concat('-').concat(tables[i].rows[0][hdr].toString().toLowerCase()));
                tcell.setAttribute('contentEditable', 'true');
                tcell.addEventListener('keypress', function(e) { if (e.keyCode === 13) { e.preventDefault();} });
                tcell.setAttribute('class', 'table-empty-edit-cell');
                tdata.appendChild(tcell);
                trow.appendChild(tdata);
            }
            tdata = document.createElement('td');
            tdata.style.borderTop = 'thin solid var(--'.concat(name.concat('-aux-pri-color)'));
            tcell = document.createElement('div');
            tdata.appendChild(tcell);
            trow.appendChild(tdata);
            tbody.appendChild(trow);
            var new_row_confirm_button = document.createElement('button');
            new_row_confirm_button.setAttribute('class', 'table-new-row-confirm-button');
            new_row_confirm_button.innerHTML = 'Confirm';
            new_row_confirm_button.onclick = function () {
                out_row = []
                for (tdi = 0; tdi < trow.childNodes.length - 1; tdi++) {
                    cv = trow.childNodes[tdi].childNodes[0].textContent;
                    if (cv == '') {
                        cv = '-';
                    }
                    out_row.push(cv);
                }
                tables[i].add_row(out_row);
                tbody.removeChild(trow);
                updateTable(name);
            }
            var new_row_cancel_button = document.createElement('button');
            new_row_cancel_button.setAttribute('class', 'table-new-row-cancel-button');
            new_row_cancel_button.innerHTML = 'Cancel';
            new_row_cancel_button.onclick = function () {
                tbody.removeChild(trow);
                new_row_button.style.display = 'inline-block';
                new_row_button_container.removeChild(new_row_confirm_button);
                new_row_button_container.removeChild(new_row_cancel_button);
                document.getElementById(name.concat('-controls-edit')).disabled = false;
            }
            new_row_button_container.appendChild(new_row_confirm_button);
            new_row_button_container.appendChild(new_row_cancel_button);
            return;
        }
    }
}

function addNewTable() {
    if (document.querySelector('input[name="new-table"]:checked').id.slice(20) == "empty") {
        var tname = document.querySelector('input[id="nt-popup-table-name-input"]').value;
        var cols = document.getElementById('nt-popup-table-editor-column-counter-value').value;
        if (tname == '') {
            tname = 'table'.concat(tables.length.toString());
        }
        var newtable = new Table(tname);
        for (c = 0; c < cols; c++) {
            newtable.add_col();
        }
        addTable(newtable);
        removePopup('nt');
    } else {
        console.log('something went wrong');
    }
}

function editMode(name) {
    var head = document.getElementById(name.concat('-head'));
    var headers = head.getElementsByClassName('table-th');
    var headercs = head.getElementsByClassName('table-thc');
    var update = false;
    if (headers.length == 0) {
        update = true;
    } 
    for (i = 0; i < headers.length; i++) {
        headers[i].classList.toggle('th-editing');
        headercs[i].classList.toggle('thc-editing');
        if (headercs[i].contentEditable != 'true') {
            headercs[i].setAttribute('contenteditable', 'true');
            headercs[i].addEventListener('keypress', function(e) { if (e.keyCode === 13) { e.preventDefault();} });
        } else {
            headercs[i].setAttribute('contenteditable', 'false');
            update = true;
        }
    }
    var body = document.getElementById(name.concat('-body'));
    var data = body.getElementsByClassName('table-data');
    var cells = body.getElementsByClassName('table-cell');
    for (i = 0; i < data.length; i++) {
        data[i].classList.toggle('td-editing');
        cells[i].classList.toggle('tc-editing');
        if (cells[i].contentEditable != 'true') {
            cells[i].setAttribute('contenteditable', 'true');
            cells[i].addEventListener('keypress', function(e) { if (e.keyCode === 13) { e.preventDefault();} });
        } else {
            cells[i].setAttribute('contenteditable', 'false');
            update = true;
        }
    }
    if (update == true) {
        for (i = 0; i < tables.length; i++) {
            if (tables[i].name == name) {
                for (hi = 0; hi < headercs.length; hi++) {
                    for (thi = 0; thi < hi; thi++) {
                        if (headercs[hi].textContent == tables[i].rows[0][thi]) {
                            headercs[hi].textContent = headercs[hi].textContent.concat('*');
                            thi = -1;
                        }
                    }
                    if (headercs[hi].textContent != tables[i].rows[0][hi]) {
                        for (ri = 1; ri < tables[i].rows.length; ri++) {
                            tables[i].rows[ri][headercs[hi].textContent] = tables[i].rows[ri][tables[i].rows[0][hi]];
                            delete tables[i].rows[ri][tables[i].rows[0][hi]];
                        }
                    }
                    tables[i].rows[0][hi] = headercs[hi].textContent;
                }
                for (ri = 0; ri < body.childNodes.length; ri++) {
                    tri = ri + 1 + (tables[i].page * tables[i].size);
                    out_row = [];
                    trow = body.childNodes[ri];
                    for (ci = 0; ci < trow.childNodes.length - 1; ci++) {
                        cv = trow.childNodes[ci].childNodes[0].textContent;
                        if (cv == '') {
                            cv = '-';
                        }
                        out_row.push(cv);
                    }
                    tables[i].add_row(out_row, index=tri, replace=true);
                }
                updateTable(name);
                return;
            }
        }
    } else {
        document.getElementById(name.concat('-new-row-button')).disabled = 'true';
        document.getElementById(name.concat('-new-column-button')).disabled = 'true';
        dcs = body.getElementsByClassName('table-row-actions-button');
        for (dc = 0; dc < dcs.length; dc++) {
            dcs[dc].disabled = 'true';
        }
    }
}

var ot = new Table('olympics-table');
ot.add_col('Year');
ot.add_col('Season');
ot.add_col('Host');
ot.add_col('City');
ot.add_col('Continent');
ot.add_row([2022, 'winter', 'China', 'Beijing', 'Asia']);
ot.add_row([2020, 'summer', 'Japan', 'Tokyo', 'Asia']);
ot.add_row([2018, 'winter', 'South Korea', 'Pyeongchang', 'Asia']);
ot.add_row([2016, 'summer', 'Brazil', 'Rio de Janeiro', 'South America']);
ot.add_row([2014, 'winter', 'Russia', 'Sochi', 'Europe']);
ot.add_row([2012, 'summer', 'United Kingdom','London', 'Europe']);
ot.add_row([2010, 'winter', 'Canada', 'Vancouver', 'North America']);
ot.add_row([2008, 'summer', 'China', 'Beijing', 'Asia']);
ot.add_row([2006, 'winter', 'Italy', 'Torino', 'Europe']);
ot.add_row([2004, 'summer', 'Greece', 'Athens', 'Europe']);
ot.add_row([2002, 'winter', 'United States', 'Salt Lake City', 'North America']);
ot.add_row([2000, 'summer', 'Australia', 'Sydney', 'Oceania']);
ot.add_row([1998, 'winter', 'Japan', 'Nagano', 'Asia']);
ot.add_row([1996, 'summer', 'United States', 'Atlanta', 'North America']);
ot.add_row([1994, 'winter', 'Norway', 'Lillehammer', 'Europe']);
ot.add_row([1992, 'summer', 'Spain', 'Barcelona', 'Europe']);
ot.add_row([1992, 'winter', 'France', 'Albertville', 'Europe']);
ot.add_row([1988, 'summer', 'South Korea', 'Seoul', 'Asia']);
ot.add_row([1988, 'winter', 'Canada', 'Calgary', 'North America']);
ot.add_row([1984, 'summer', 'United States', 'Los Angeles', 'North America']);
ot.add_row([1984, 'winter', 'Yugoslavia', 'Sarajevo', 'Europe']);
ot.add_row([1980, 'summer', 'Soviet Union', 'Moscow', 'Europe']);
ot.add_row([1980, 'winter', 'United States', 'Lake Placid', 'North America']);
ot.add_row([1976, 'summer', 'Canada', 'Montreal', 'North America']);
ot.add_row([1976, 'winter', 'Austria', 'Innsbruck', 'Europe']);
ot.add_row([1972, 'summer', 'West Germany', 'Munich', 'Europe']);
ot.add_row([1972, 'winter', 'Japan', 'Tokyo', 'Asia']);

var at = new Table('animals-table');
at.add_col('Name');
at.add_col('Class');
at.add_col('Diet');
at.add_col('Ecosystem');
at.add_row(['Gorilla', 'Mammal', 'Herbivore', 'Terrestrial']);
at.add_row(['Blue Whale', 'Mammal', 'Carnivore', 'Aquatic']);
at.add_row(['Cheetah', 'Mammal', 'Carnivore', 'Terrestrial']);
at.add_row(['Moose', 'Mammal', 'Herbivore', 'Terrestrial']);
at.add_row(['Grizzly Bear', 'Mammal', 'Omnivore', 'Terrestrial']);
at.add_row(['African Dwarf Frog', 'Amphibian', 'Carnivore', 'Aquatic']);
at.add_row(['Sea Turtle', 'Reptile', 'Omnivorous', 'Aquatic']);

var et = new Table('empty-table');

//addTable(ot);
//addTable(at);
//addTable(et);
