import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("Sidebar");
const maxZoom = 19;
const sidebar = document.getElementById('sidebar');
const mapdiv = document.getElementById('map');

const closeSidebar = () => {
    mapdiv.style.marginLeft = '0';
    sidebar.style.marginLeft = '-300px';
    sidebar.innerHTML = '';
    map.marginLeft = '0';
    }

const openSidebar = (data) => {
    sidebar.innerHTML = '';
    sidebar.style.marginLeft = '0';
    sidebar.appendChild(data);
    mapdiv.style.marginLeft = '300px';
    
    }

map.on('click', () => {
    closeSidebar();
});

plugin.addEventListener('EventToPlugin', (e) => {
    if (e.detail.eventName == 'pluginLoaded') {
        plugin.dispatchEvent(new CustomEvent('EventFromPlugin', {detail: {data:openSidebar, eventName: 'sidebarLoaded'}}));
    };


});

export default plugin;
