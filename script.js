// Данные о странах Европы
const countriesData = {
    'france': {
        name: 'Франция',
        color: '#0055A4',
        gold: 1200,
        food: 600,
        army: 15,
        tech: 1,
        capital: 'Париж',
        region: 'Западная Европа'
    },
    'germany': {
        name: 'Германия',
        color: '#000000',
        gold: 1500,
        food: 500,
        army: 20,
        tech: 2,
        capital: 'Берлин',
        region: 'Центральная Европа'
    },
    'italy': {
        name: 'Италия',
        color: '#008C45',
        gold: 1000,
        food: 700,
        army: 12,
        tech: 1,
        capital: 'Рим',
        region: 'Южная Европа'
    },
    'spain': {
        name: 'Испания',
        color: '#AA151B',
        gold: 1100,
        food: 650,
        army: 14,
        tech: 1,
        capital: 'Мадрид',
        region: 'Пиренейский полуостров'
    },
    'poland': {
        name: 'Польша',
        color: '#DC143C',
        gold: 900,
        food: 550,
        army: 18,
        tech: 1,
        capital: 'Варшава',
        region: 'Восточная Европа'
    },
    'ukraine': {
        name: 'Украина',
        color: '#FFD700',
        gold: 800,
        food: 800,
        army: 16,
        tech: 1,
        capital: 'Киев',
        region: 'Восточная Европа'
    },
    'uk': {
        name: 'Великобритания',
        color: '#012169',
        gold: 1800,
        food: 400,
        army: 22,
        tech: 2,
        capital: 'Лондон',
        region: 'Британские острова'
    },
    'sweden': {
        name: 'Швеция',
        color: '#005B99',
        gold: 1300,
        food: 450,
        army: 13,
        tech: 2,
        capital: 'Стокгольм',
        region: 'Скандинавия'
    }
};

// Состояние игры
let gameState = {
    turn: 1,
    currentPlayer: 'france', // Игрок управляет Францией
    countries: JSON.parse(JSON.stringify(countriesData)), // Копия данных
    selectedRegion: null,
    regions: [
        // Западная Европа
        { id: 'paris', name: 'Париж', country: 'france', x: 200, y: 300, type: 'capital', development: 5 },
        { id: 'lyon', name: 'Лион', country: 'france', x: 220, y: 350, type: 'city', development: 3 },
        { id: 'berlin', name: 'Берлин', country: 'germany', x: 400, y: 250, type: 'capital', development: 5 },
        { id: 'munich', name: 'Мюнхен', country: 'germany', x: 420, y: 300, type: 'city', development: 4 },
        { id: 'hamburg', name: 'Гамбург', country: 'germany', x: 380, y: 200, type: 'port', development: 4 },
        
        // Южная Европа
        { id: 'rome', name: 'Рим', country: 'italy', x: 420, y: 450, type: 'capital', development: 5 },
        { id: 'milan', name: 'Милан', country: 'italy', x: 400, y: 400, type: 'city', development: 4 },
        { id: 'naples', name: 'Неаполь', country: 'italy', x: 450, y: 480, type: 'port', development: 3 },
        { id: 'madrid', name: 'Мадрид', country: 'spain', x: 100, y: 450, type: 'capital', development: 4 },
        { id: 'barcelona', name: 'Барселона', country: 'spain', x: 150, y: 470, type: 'port', development: 4 },
        
        // Восточная Европа
        { id: 'warsaw', name: 'Варшава', country: 'poland', x: 550, y: 280, type: 'capital', development: 4 },
        { id: 'krakow', name: 'Краков', country: 'poland', x: 530, y: 320, type: 'city', development: 3 },
        { id: 'kyiv', name: 'Киев', country: 'ukraine', x: 650, y: 320, type: 'capital', development: 4 },
        { id: 'lviv', name: 'Львов', country: 'ukraine', x: 580, y: 330, type: 'city', development: 3 },
        { id: 'odessa', name: 'Одесса', country: 'ukraine', x: 670, y: 380, type: 'port', development: 3 },
        
        // Британские острова
        { id: 'london', name: 'Лондон', country: 'uk', x: 50, y: 200, type: 'capital', development: 5 },
        { id: 'manchester', name: 'Манчестер', country: 'uk', x: 30, y: 170, type: 'city', development: 4 },
        { id: 'edinburgh', name: 'Эдинбург', country: 'uk', x: 40, y: 100, type: 'city', development: 3 },
        
        // Скандинавия
        { id: 'stockholm', name: 'Стокгольм', country: 'sweden', x: 500, y: 80, type: 'capital', development: 4 },
        { id: 'gothenburg', name: 'Гётеборг', country: 'sweden', x: 470, y: 120, type: 'port', development: 3 }
    ]
};

// Инициализация игры
function initGame() {
    updateResourcesDisplay();
    createCountriesList();
    createMap();
    updateActionPanel();
}

// Создание списка стран
function createCountriesList() {
    const container = document.getElementById('countriesList');
    container.innerHTML = '';
    
    Object.entries(gameState.countries).forEach(([code, country]) => {
        const div = document.createElement('div');
        div.className = `country-item ${code === gameState.currentPlayer ? 'selected' : ''}`;
        div.dataset.country = code;
        
        div.innerHTML = `
            <div class="country-color" style="background: ${country.color}"></div>
            <span class="country-name">${country.name}</span>
            <span class="country-army">⚔️ ${country.army}</span>
        `;
        
        div.addEventListener('click', () => selectCountry(code));
        container.appendChild(div);
    });
}

// Выбор страны
function selectCountry(countryCode) {
    gameState.selectedRegion = null;
    updateActionPanel();
    
    // Подсветка выбранной страны
    document.querySelectorAll('.country-item').forEach(item => {
        item.classList.toggle('selected', item.dataset.country === countryCode);
    });
    
    // Показываем информацию о стране
    const country = gameState.countries[countryCode];
    document.getElementById('selectedInfo').innerHTML = `
        <h3>${country.name}</h3>
        <p>Столица: ${country.capital}</p>
        <p>Регион: ${country.region}</p>
        <p>💰 Золото: ${country.gold}</p>
        <p>🌾 Еда: ${country.food}</p>
        <p>⚔️ Армия: ${country.army}</p>
        <p>🔬 Технологии: ${country.tech}</p>
    `;
}

// Создание карты
function createMap() {
    const svg = document.getElementById('europeMap');
    svg.innerHTML = '';
    
    // Создаем регионы как прямоугольники (для простоты)
    // В реальном проекте здесь будут SVG пути из карты Европы
    gameState.regions.forEach((region, index) => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const country = gameState.countries[region.country];
        
        rect.setAttribute('x', region.x);
        rect.setAttribute('y', region.y);
        rect.setAttribute('width', '60');
        rect.setAttribute('height', '40');
        rect.setAttribute('class', 'region');
        rect.setAttribute('data-region', region.id);
        rect.setAttribute('fill', country ? country.color : '#CCCCCC');
        rect.setAttribute('rx', '5');
        rect.setAttribute('ry', '5');
        
        rect.addEventListener('click', () => selectRegion(region.id));
        
        svg.appendChild(rect);
        
        // Добавляем название региона
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', region.x + 30);
        text.setAttribute('y', region.y + 25);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '8');
        text.setAttribute('pointer-events', 'none');
        text.textContent = region.name;
        
        svg.appendChild(text);
    });
}

// Выбор региона
function selectRegion(regionId) {
    const region = gameState.regions.find(r => r.id === regionId);
    if (!region) return;
    
    gameState.selectedRegion = region;
    
    // Подсветка выбранного региона
    document.querySelectorAll('.region').forEach(r => {
        r.classList.toggle('selected', r.dataset.region === regionId);
    });
    
    updateActionPanel();
}

// Обновление панели действий
function updateActionPanel() {
    const container = document.getElementById('actionButtons');
    const player = gameState.countries[gameState.currentPlayer];
    const region = gameState.selectedRegion;
    
    let html = '';
    
    if (!region) {
        html = '<p>Выберите регион на карте</p>';
    } else if (region.country === gameState.currentPlayer) {
        // Свой регион
        html = `
            <button class="action-btn" onclick="developRegion()" ${player.gold < 100 ? 'disabled' : ''}>
                <span>📈</span> Развивать регион
                <span class="cost-badge">100💰</span>
            </button>
            <button class="action-btn" onclick="recruitTroops()" ${player.gold < 200 ? 'disabled' : ''}>
                <span>⚔️</span> Набрать войска
                <span class="cost-badge">200💰</span>
            </button>
        `;
    } else {
        // Чужой регион
        const enemy = gameState.countries[region.country];
        const canAttack = player.army > enemy.army * 0.7;
        
        html = `
            <button class="action-btn cost" onclick="attackRegion()" ${!canAttack ? 'disabled' : ''}>
                <span>⚔️</span> Атаковать
                <span class="cost-badge">${enemy.army}⚔️ vs ${player.army}⚔️</span>
            </button>
            ${canAttack ? '' : '<p class="warning">⚠️ Слишком опасно!</p>'}
        `;
    }
    
    // Кнопка исследования технологий
    html += `
        <button class="action-btn" onclick="researchTech()" ${player.gold < player.tech * 300 ? 'disabled' : ''}>
            <span>🔬</span> Исследовать технологии
            <span class="cost-badge">${player.tech * 300}💰</span>
        </button>
    `;
    
    container.innerHTML = html;
}

// Действия игрока
function developRegion() {
    const player = gameState.countries[gameState.currentPlayer];
    const region = gameState.selectedRegion;
    
    if (player.gold >= 100 && region) {
        player.gold -= 100;
        region.development += 1;
        
        showMessage(`✅ Регион ${region.name} развит! Уровень: ${region.development}`);
        updateResourcesDisplay();
        updateActionPanel();
    }
}

function recruitTroops() {
    const player = gameState.countries[gameState.currentPlayer];
    
    if (player.gold >= 200) {
        player.gold -= 200;
        player.army += 5;
        
        showMessage(`✅ Набрано 5 новых войск! Армия: ${player.army}`);
        updateResourcesDisplay();
        updateActionPanel();
        createCountriesList(); // Обновляем список
    }
}

function attackRegion() {
    const player = gameState.countries[gameState.currentPlayer];
    const region = gameState.selectedRegion;
    const enemy = gameState.countries[region.country];
    
    // Простая боевая система
    const playerPower = player.army * player.tech;
    const enemyPower = enemy.army * enemy.tech;
    
    if (playerPower > enemyPower) {
        // Победа
        const losses = Math.floor(player.army * 0.3);
        player.army -= losses;
        enemy.army = Math.floor(enemy.army * 0.5);
        
        // Захватываем регион
        region.country = gameState.currentPlayer;
        
        showMessage(`✅ Победа! Захвачен регион ${region.name}. Потери: ${losses}`);
    } else {
        // Поражение
        const losses = Math.floor(player.army * 0.5);
        player.army -= losses;
        
        showMessage(`❌ Поражение! Потеряно ${losses} войск`);
    }
    
    createMap();
    updateResourcesDisplay();
    updateActionPanel();
    createCountriesList();
}

function researchTech() {
    const player = gameState.countries[gameState.currentPlayer];
    const cost = player.tech * 300;
    
    if (player.gold >= cost) {
        player.gold -= cost;
        player.tech += 1;
        
        showMessage(`✅ Исследован новый уровень технологий! Текущий: ${player.tech}`);
        updateResourcesDisplay();
        updateActionPanel();
    }
}

// Завершение хода
function endTurn() {
    gameState.turn++;
    
    // Производство ресурсов для всех стран
    Object.values(gameState.countries).forEach(country => {
        // Базовый доход
        country.gold += 100;
        country.food += 50;
        
        // Дополнительный доход от регионов
        const ownedRegions = gameState.regions.filter(r => r.country === country.name);
        ownedRegions.forEach(region => {
            country.gold += region.development * 10;
            country.food += region.development * 5;
        });
        
        // Восстановление армии
        country.army = Math.floor(country.army * 1.1);
    });
    
    updateResourcesDisplay();
    document.getElementById('turn').textContent = gameState.turn;
    showMessage(`🔄 Ход ${gameState.turn} начался!`);
}

// Обновление отображения ресурсов
function updateResourcesDisplay() {
    const player = gameState.countries[gameState.currentPlayer];
    document.getElementById('gold').textContent = player.gold;
    document.getElementById('food').textContent = player.food;
    document.getElementById('army').textContent = player.army;
    document.getElementById('tech').textContent = player.tech;
}

// Показ сообщений
function showMessage(text) {
    // Создаем временное уведомление
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #16213e;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        border-left: 4px solid #e94560;
        z-index: 1000;
        animation: slideIn 0.3s;
    `;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.remove();
    }, 3000);
}

// Добавляем анимацию
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Запуск игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    document.getElementById('endTurnBtn').addEventListener('click', endTurn);
});
