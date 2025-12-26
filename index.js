// ====================== 全局变量定义 ======================
let cart = []; // 购物车数组：存储商品对象，格式为 {id, name, price, image, quantity}
let isLoggedIn = false; // 登录状态标识：true 表示已登录，false 表示未登录
let currentUser = null; // 当前用户信息：存储登录用户的手机号、用户名等信息

// ====================== DOM 加载完成后初始化 ======================
document.addEventListener('DOMContentLoaded', () => {
    // DOMContentLoaded 事件监听器：当 HTML 文档完全加载和解析完成后执行
    checkLoginStatus(); // 调用函数：检查本地存储中的登录状态
    updateCart(); // 调用函数：初始化购物车显示
    bindEvents(); // 调用函数：绑定所有页面事件
});

// ====================== 事件绑定 ======================
function bindEvents() {
    // 定义函数：将所有页面元素的事件监听器集中绑定
    
    // 登录相关元素
    const loginModal = document.getElementById('loginModal'); // 获取登录模态框元素
    const loginBtn = document.getElementById('loginBtn'); // 获取登录按钮（桌面端）
    const mobileLoginBtn = document.getElementById('mobileLoginBtn'); // 获取移动端登录按钮
    const closeLoginBtn = document.getElementById('closeLoginBtn'); // 获取关闭登录弹窗按钮
    const loginOverlay = document.getElementById('loginOverlay'); // 获取登录弹窗遮罩层
    const loginTab = document.getElementById('loginTab'); // 获取登录选项卡按钮
    const registerTab = document.getElementById('registerTab'); // 获取注册选项卡按钮
    const goToRegister = document.getElementById('goToRegister'); // 获取"去注册"链接
    const goToLogin = document.getElementById('goToLogin'); // 获取"去登录"链接
    const doLoginBtn = document.getElementById('doLoginBtn'); // 获取登录提交按钮
    const doRegisterBtn = document.getElementById('doRegisterBtn'); // 获取注册提交按钮
    const getCodeBtn = document.getElementById('getCodeBtn'); // 获取验证码按钮
    const logoutBtn = document.getElementById('logoutBtn'); // 获取退出登录按钮
    const mobileMenuBtn = document.getElementById('mobileMenuBtn'); // 获取移动端菜单按钮
    const mobileMenu = document.getElementById('mobileMenu'); // 获取移动端菜单容器

    // 购物车相关元素
    const cartBtn = document.getElementById('cartBtn'); // 获取购物车按钮
    const cartSidebar = document.getElementById('cartSidebar'); // 获取购物车侧边栏
    const closeCartBtn = document.getElementById('closeCartBtn'); // 获取关闭购物车按钮
    const overlay = document.getElementById('overlay'); // 获取购物车遮罩层
    const checkoutBtn = document.getElementById('checkoutBtn'); // 获取结算按钮
    const addToCartButtons = document.querySelectorAll('.add-to-cart'); // 获取所有"加入购物车"按钮

    // ---------------- 登录相关事件 ----------------
    loginBtn.addEventListener('click', openLoginModal); // 为登录按钮添加点击事件，调用打开登录弹窗函数
    mobileLoginBtn.addEventListener('click', () => {
        // 为移动端登录按钮添加点击事件（箭头函数）
        mobileMenu.classList.add('hidden'); // 隐藏移动端菜单
        openLoginModal(); // 调用打开登录弹窗函数
    });
    closeLoginBtn.addEventListener('click', closeLoginModal); // 为关闭按钮添加点击事件，调用关闭登录弹窗函数
    loginOverlay.addEventListener('click', closeLoginModal); // 为遮罩层添加点击事件，点击遮罩层也关闭弹窗
    loginTab.addEventListener('click', switchToLogin); // 为登录选项卡添加点击事件，切换到登录表单
    registerTab.addEventListener('click', switchToRegister); // 为注册选项卡添加点击事件，切换到注册表单
    
    goToRegister.addEventListener('click', (e) => {
        // 为"去注册"链接添加点击事件（箭头函数）
        e.preventDefault(); // 阻止链接默认跳转行为
        switchToRegister(); // 调用切换到注册表单函数
    });
    
    goToLogin.addEventListener('click', (e) => {
        // 为"去登录"链接添加点击事件（箭头函数）
        e.preventDefault(); // 阻止链接默认跳转行为
        switchToLogin(); // 调用切换到登录表单函数
    });
    
    doLoginBtn.addEventListener('click', login); // 为登录提交按钮添加点击事件，调用登录函数
    doRegisterBtn.addEventListener('click', register); // 为注册提交按钮添加点击事件，调用注册函数
    getCodeBtn.addEventListener('click', getVerificationCode); // 为获取验证码按钮添加点击事件，调用获取验证码函数
    logoutBtn.addEventListener('click', logout); // 为退出登录按钮添加点击事件，调用退出登录函数

    // ---------------- 移动端菜单事件 ----------------
    mobileMenuBtn.addEventListener('click', () => {
        // 为移动端菜单按钮添加点击事件（箭头函数）
        mobileMenu.classList.toggle('hidden'); // 切换移动端菜单的显示/隐藏状态
    });

    // ---------------- 购物车相关事件 ----------------
    cartBtn.addEventListener('click', () => {
        // 为购物车按钮添加点击事件（箭头函数）
        if (!isLoggedIn) { // 检查用户是否登录
            alert('请先登录后再使用购物车功能'); // 弹出提示信息
            openLoginModal(); // 调用打开登录弹窗函数
            return; // 终止函数执行
        }
        cartSidebar.classList.remove('translate-x-full'); // 移除侧边栏的右侧偏移类，显示购物车
        overlay.classList.remove('hidden'); // 移除遮罩层的隐藏类，显示遮罩层
        document.body.style.overflow = 'hidden'; // 设置body溢出隐藏，防止页面滚动
    });

    closeCartBtn.addEventListener('click', closeCart); // 为关闭购物车按钮添加点击事件，调用关闭购物车函数
    overlay.addEventListener('click', closeCart); // 为购物车遮罩层添加点击事件，点击遮罩层也关闭购物车
    checkoutBtn.addEventListener('click', () => {
        // 为结算按钮添加点击事件（箭头函数）
        if (cart.length === 0) return; // 如果购物车为空，直接返回
        alert(`结算成功！订单总额：${document.getElementById('cartTotal').textContent}\n感谢您的购买，${currentUser.username}！`); // 弹出结算成功提示
        cart = []; // 清空购物车数组
        updateCart(); // 调用更新购物车显示函数
    });

    // 加入购物车按钮事件
    addToCartButtons.forEach(btn => {
        // 遍历所有"加入购物车"按钮
        btn.addEventListener('click', handleAddToCart); // 为每个按钮添加点击事件，调用处理添加商品函数
    });

    // ---------------- 平滑滚动事件 ----------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // 选择所有href以"#"开头的链接（锚点链接）
        anchor.addEventListener('click', function (e) {
            // 为每个链接添加点击事件
            e.preventDefault(); // 阻止链接默认跳转行为
            const targetId = this.getAttribute('href'); // 获取链接的href属性值（如"#home"）
            const targetElement = document.querySelector(targetId); // 根据id选择目标元素
            if (targetElement) { // 如果目标元素存在
                targetElement.scrollIntoView({ behavior: 'smooth' }); // 平滑滚动到目标元素位置
                if (!mobileMenu.classList.contains('hidden')) { // 如果移动端菜单是展开状态
                    mobileMenu.classList.add('hidden'); // 隐藏移动端菜单
                }
            }
        });
    });
}

// ====================== 登录功能 ======================
/**
 * 打开登录弹窗
 */
function openLoginModal() {
    const loginModal = document.getElementById('loginModal'); // 获取登录模态框元素
    loginModal.classList.remove('hidden'); // 移除隐藏类，显示登录弹窗
    document.body.style.overflow = 'hidden'; // 设置body溢出隐藏，防止页面滚动
    switchToLogin(); // 调用切换到登录表单函数，确保显示登录表单
}

/**
 * 关闭登录弹窗
 */
function closeLoginModal() {
    const loginModal = document.getElementById('loginModal'); // 获取登录模态框元素
    loginModal.classList.add('hidden'); // 添加隐藏类，隐藏登录弹窗
    document.body.style.overflow = ''; // 恢复body的overflow属性，允许页面滚动
    clearFormErrors(); // 调用清空表单错误提示函数
}

/**
 * 切换到登录表单
 */
function switchToLogin() {
    const loginForm = document.getElementById('loginForm'); // 获取登录表单容器
    const registerForm = document.getElementById('registerForm'); // 获取注册表单容器
    const loginTab = document.getElementById('loginTab'); // 获取登录选项卡按钮
    const registerTab = document.getElementById('registerTab'); // 获取注册选项卡按钮

    loginForm.classList.remove('hidden'); // 移除登录表单的隐藏类
    registerForm.classList.add('hidden'); // 添加注册表单的隐藏类
    
    loginTab.classList.add('text-primary', 'border-b-2', 'border-primary'); // 为登录选项卡添加激活样式（蓝色文字和底部边框）
    loginTab.classList.remove('text-gray-500'); // 移除登录选项卡的灰色文字样式
    registerTab.classList.add('text-gray-500'); // 为注册选项卡添加灰色文字样式
    registerTab.classList.remove('text-primary', 'border-b-2', 'border-primary'); // 移除注册选项卡的激活样式
    
    clearFormErrors(); // 调用清空表单错误提示函数
}

/**
 * 切换到注册表单
 */
function switchToRegister() {
    const loginForm = document.getElementById('loginForm'); // 获取登录表单容器
    const registerForm = document.getElementById('registerForm'); // 获取注册表单容器
    const loginTab = document.getElementById('loginTab'); // 获取登录选项卡按钮
    const registerTab = document.getElementById('registerTab'); // 获取注册选项卡按钮

    registerForm.classList.remove('hidden'); // 移除注册表单的隐藏类
    loginForm.classList.add('hidden'); // 添加登录表单的隐藏类
    
    registerTab.classList.add('text-primary', 'border-b-2', 'border-primary'); // 为注册选项卡添加激活样式
    registerTab.classList.remove('text-gray-500'); // 移除注册选项卡的灰色文字样式
    loginTab.classList.add('text-gray-500'); // 为登录选项卡添加灰色文字样式
    loginTab.classList.remove('text-primary', 'border-b-2', 'border-primary'); // 移除登录选项卡的激活样式
    
    clearFormErrors(); // 调用清空表单错误提示函数
}

/**
 * 清空所有表单错误提示
 */
function clearFormErrors() {
    document.querySelectorAll('[id$="Error"]').forEach(el => {
        // 选择所有id以"Error"结尾的元素（所有错误提示元素）
        el.classList.add('hidden'); // 为每个错误提示元素添加隐藏类
    });
}

/**
 * 验证手机号格式
 * @param {string} phone - 手机号
 * @returns {boolean} 验证结果
 */
function validatePhone(phone) {
    const reg = /^1[3-9]\d{9}$/; // 正则表达式：以1开头，第二位是3-9，后面跟9位数字
    return reg.test(phone); // 使用test方法验证手机号格式，返回布尔值
}

/**
 * 获取验证码
 */
function getVerificationCode() {
    const phone = document.getElementById('registerPhone').value.trim(); // 获取注册手机号输入框的值并去除空格
    const phoneError = document.getElementById('registerPhoneError'); // 获取手机号错误提示元素
    const getCodeBtn = document.getElementById('getCodeBtn'); // 获取验证码按钮元素

    if (!validatePhone(phone)) { // 验证手机号格式
        phoneError.textContent = '请输入正确的手机号'; // 设置错误提示文本
        phoneError.classList.remove('hidden'); // 显示错误提示
        return; // 终止函数执行
    }

    // 倒计时逻辑
    let countdown = 60; // 设置倒计时初始值（60秒）
    getCodeBtn.disabled = true; // 禁用验证码按钮，防止重复点击
    getCodeBtn.textContent = `${countdown}秒后重新获取`; // 更新按钮文字为倒计时

    const timer = setInterval(() => {
        // 使用setInterval设置定时器，每秒执行一次
        countdown--; // 倒计时减1
        getCodeBtn.textContent = `${countdown}秒后重新获取`; // 更新按钮文字
        if (countdown <= 0) { // 如果倒计时结束
            clearInterval(timer); // 清除定时器
            getCodeBtn.disabled = false; // 重新启用按钮
            getCodeBtn.textContent = '获取验证码'; // 恢复按钮原始文字
        }
    }, 1000); // 定时器间隔：1000毫秒（1秒）

    alert(`验证码已发送到手机号 ${phone}，验证码为：123456`); // 模拟发送验证码，弹出提示（实际开发中应调用后端API）
}

/**
 * 登录逻辑
 */
function login() {
    const phone = document.getElementById('loginPhone').value.trim(); // 获取登录手机号
    const password = document.getElementById('loginPassword').value.trim(); // 获取登录密码
    const rememberPwd = document.getElementById('rememberPwd').checked; // 获取"记住密码"复选框状态
    const phoneError = document.getElementById('loginPhoneError'); // 获取手机号错误提示元素
    const passwordError = document.getElementById('loginPasswordError'); // 获取密码错误提示元素

    let isValid = true; // 表单验证通过标识，初始为true

    // 验证手机号
    if (!validatePhone(phone)) { // 如果手机号格式不正确
        phoneError.classList.remove('hidden'); // 显示手机号错误提示
        isValid = false; // 设置验证失败
    } else {
        phoneError.classList.add('hidden'); // 隐藏手机号错误提示
    }

    // 验证密码
    if (!password) { // 如果密码为空
        passwordError.textContent = '密码不能为空'; // 设置错误提示文本
        passwordError.classList.remove('hidden'); // 显示密码错误提示
        isValid = false; // 设置验证失败
    } else {
        passwordError.classList.add('hidden'); // 隐藏密码错误提示
    }

    if (!isValid) return; // 如果验证失败，终止函数执行

    // 模拟登录成功（实际开发中应调用后端API验证）
    isLoggedIn = true; // 设置登录状态为true
    currentUser = { // 创建当前用户对象
        phone: phone, // 存储手机号
        username: `用户${phone.slice(-4)}` // 生成用户名：用户+手机号后4位
    };

    // 记住密码功能
    if (rememberPwd) { // 如果勾选了"记住密码"
        localStorage.setItem('isLoggedIn', 'true'); // 将登录状态存储到localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser)); // 将用户信息转为JSON字符串存储
    }

    // 更新UI
    updateUserUI(); // 调用更新用户UI函数
    closeLoginModal(); // 调用关闭登录弹窗函数
    alert(`登录成功！欢迎您，${currentUser.username}`); // 弹出登录成功提示

    // 清空表单
    document.getElementById('loginPhone').value = ''; // 清空手机号输入框
    document.getElementById('loginPassword').value = ''; // 清空密码输入框
}

/**
 * 注册逻辑
 */
function register() {
    const phone = document.getElementById('registerPhone').value.trim(); // 获取注册手机号
    const code = document.getElementById('registerCode').value.trim(); // 获取验证码
    const password = document.getElementById('registerPassword').value.trim(); // 获取注册密码
    const agreeTerms = document.getElementById('agreeTerms').checked; // 获取同意协议复选框状态

    const phoneError = document.getElementById('registerPhoneError'); // 获取手机号错误提示元素
    const codeError = document.getElementById('registerCodeError'); // 获取验证码错误提示元素
    const passwordError = document.getElementById('registerPasswordError'); // 获取密码错误提示元素
    const agreeTermsError = document.getElementById('agreeTermsError'); // 获取协议错误提示元素

    let isValid = true; // 表单验证通过标识

    // 验证手机号
    if (!validatePhone(phone)) { // 验证手机号格式
        phoneError.classList.remove('hidden'); // 显示手机号错误
        isValid = false; // 设置验证失败
    } else {
        phoneError.classList.add('hidden'); // 隐藏手机号错误
    }

    // 验证验证码
    if (!code || code !== '123456') { // 验证码为空或不等于"123456"（模拟验证码）
        codeError.textContent = '验证码不正确'; // 设置错误提示文本
        codeError.classList.remove('hidden'); // 显示验证码错误
        isValid = false; // 设置验证失败
    } else {
        codeError.classList.add('hidden'); // 隐藏验证码错误
    }

    // 验证密码
    if (password.length < 6 || password.length > 16) { // 密码长度不在6-16位之间
        passwordError.classList.remove('hidden'); // 显示密码错误
        isValid = false; // 设置验证失败
    } else {
        passwordError.classList.add('hidden'); // 隐藏密码错误
    }

    // 验证协议
    if (!agreeTerms) { // 如果没有勾选同意协议
        agreeTermsError.classList.remove('hidden'); // 显示协议错误
        isValid = false; // 设置验证失败
    } else {
        agreeTermsError.classList.add('hidden'); // 隐藏协议错误
    }

    if (!isValid) return; // 如果验证失败，终止函数执行

    // 模拟注册成功（实际开发中应调用后端API）
    alert('注册成功！请登录'); // 弹出注册成功提示
    switchToLogin(); // 切换到登录表单

    // 清空表单
    document.getElementById('registerPhone').value = ''; // 清空手机号输入框
    document.getElementById('registerCode').value = ''; // 清空验证码输入框
    document.getElementById('registerPassword').value = ''; // 清空密码输入框
    document.getElementById('agreeTerms').checked = false; // 取消勾选协议复选框
}

/**
 * 退出登录
 */
function logout() {
    isLoggedIn = false; // 设置登录状态为false
    currentUser = null; // 清空当前用户信息

    // 清除本地存储
    localStorage.removeItem('isLoggedIn'); // 移除登录状态存储
    localStorage.removeItem('currentUser'); // 移除用户信息存储

    // 更新UI
    updateUserUI(); // 调用更新用户UI函数
    alert('已成功退出登录'); // 弹出退出登录提示
}

/**
 * 更新用户UI显示
 */
function updateUserUI() {
    const loginBtn = document.getElementById('loginBtn'); // 获取登录按钮
    const userInfo = document.getElementById('userInfo'); // 获取用户信息容器
    const usernameDisplay = document.getElementById('usernameDisplay'); // 获取用户名显示元素

    if (isLoggedIn && currentUser) { // 如果已登录且有用户信息
        loginBtn.classList.add('hidden'); // 隐藏登录按钮
        userInfo.classList.remove('hidden'); // 显示用户信息容器
        usernameDisplay.textContent = currentUser.username; // 设置用户名显示文本
    } else { // 如果未登录
        loginBtn.classList.remove('hidden'); // 显示登录按钮
        userInfo.classList.add('hidden'); // 隐藏用户信息容器
    }
}

/**
 * 检查登录状态（从本地存储恢复）
 */
function checkLoginStatus() {
    const savedLoginStatus = localStorage.getItem('isLoggedIn'); // 从localStorage获取登录状态
    const savedUser = localStorage.getItem('currentUser'); // 从localStorage获取用户信息

    if (savedLoginStatus === 'true' && savedUser) { // 如果保存了登录状态和用户信息
        isLoggedIn = true; // 设置登录状态为true
        currentUser = JSON.parse(savedUser); // 将JSON字符串解析为用户对象
        updateUserUI(); // 调用更新用户UI函数
    }
}

// ====================== 购物车功能 ======================
/**
 * 关闭购物车
 */
function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar'); // 获取购物车侧边栏
    const overlay = document.getElementById('overlay'); // 获取购物车遮罩层
    
    cartSidebar.classList.add('translate-x-full'); // 添加右侧偏移类，隐藏购物车
    overlay.classList.add('hidden'); // 添加隐藏类，隐藏遮罩层
    document.body.style.overflow = ''; // 恢复body的overflow属性，允许页面滚动
}

/**
 * 处理添加商品到购物车
 * @param {Event} e - 点击事件
 */
function handleAddToCart(e) {
    if (!isLoggedIn) { // 检查用户是否登录
        alert('请先登录后再添加商品'); // 弹出提示信息
        openLoginModal(); // 调用打开登录弹窗函数
        return; // 终止函数执行
    }

    const target = e.target; // 获取事件目标（被点击的元素）
    // 兼容按钮内图标点击：如果点击的是图标，通过parentElement获取按钮的数据
    const id = target.dataset.id || target.parentElement.dataset.id; // 获取商品ID
    const name = target.dataset.name || target.parentElement.dataset.name; // 获取商品名称
    const price = parseFloat(target.dataset.price || target.parentElement.dataset.price); // 获取商品价格并转为浮点数
    const image = target.dataset.image || target.parentElement.dataset.image; // 获取商品图片

    // 检查商品是否已存在
    const existingItem = cart.find(item => item.id === id); // 在购物车数组中查找相同ID的商品
    if (existingItem) { // 如果商品已存在
        existingItem.quantity += 1; // 将商品数量加1
    } else { // 如果商品不存在
        cart.push({ id, name, price, image, quantity: 1 }); // 向购物车数组添加新商品对象
    }

    // 更新购物车
    updateCart(); // 调用更新购物车显示函数
    alert('商品已添加到购物车！'); // 弹出添加成功提示
}

/**
 * 更新购物车显示
 */
function updateCart() {
    const cartCount = document.getElementById('cartCount'); // 获取购物车数量角标
    const cartItems = document.getElementById('cartItems'); // 获取购物车商品列表容器
    const cartTotal = document.getElementById('cartTotal'); // 获取购物车总计金额元素
    const checkoutBtn = document.getElementById('checkoutBtn'); // 获取结算按钮

    // 更新数量角标
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0); 
    // 使用reduce方法计算购物车商品总数量，并更新角标显示

    // 空购物车处理
    if (cart.length === 0) { // 如果购物车数组为空
        //设置购物车列表容器的HTML
        cartItems.innerHTML = ` 
            <div class="text-center text-gray-500 py-10">
                <i class="fa fa-shopping-cart text-4xl mb-3"></i>
                <p>购物车是空的</p>
            </div>
        `;
        cartTotal.textContent = '¥0.00'; // 设置总计金额为0.00
        checkoutBtn.disabled = true; // 禁用结算按钮
        return; // 终止函数执行
    }

    // 渲染购物车商品
    let html = ''; // 初始化HTML字符串
    let total = 0; // 初始化总金额

    cart.forEach(item => { // 遍历购物车数组中的每个商品
        const itemTotal = item.price * item.quantity; // 计算当前商品的小计金额
        total += itemTotal; // 累加到总金额
        //拼接商品HTML字符串
        html += ` 
            <div class="flex border-b pb-4 mb-4 cart-item-enter">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                <div class="ml-4 flex-grow">
                    <h4 class="font-medium">${item.name}</h4>
                    <p class="text-primary font-bold">¥${item.price}</p>
                    <div class="flex items-center mt-2">
                        <button class="decrease-btn bg-gray-100 px-2 rounded hover:bg-gray-200" data-id="${item.id}">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="increase-btn bg-gray-100 px-2 rounded hover:bg-gray-200" data-id="${item.id}">+</button>
                        <button class="remove-btn text-red-500 ml-4 hover:text-red-600" data-id="${item.id}">删除</button>
                    </div>
                </div>
            </div>
        `;
    });

    // 更新DOM
    cartItems.innerHTML = html; // 将拼接的HTML设置到购物车列表容器
    cartTotal.textContent = `¥${total.toFixed(2)}`; // 设置总计金额，保留两位小数
    checkoutBtn.disabled = false; // 启用结算按钮

    // 绑定数量修改/删除事件
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        // 选择所有减少数量按钮
        btn.addEventListener('click', (e) => changeQuantity(e.target.dataset.id, -1)); 
        // 为每个按钮添加点击事件，调用修改数量函数，参数-1表示减少
    });

    document.querySelectorAll('.increase-btn').forEach(btn => {
        // 选择所有增加数量按钮
        btn.addEventListener('click', (e) => changeQuantity(e.target.dataset.id, 1)); 
        // 为每个按钮添加点击事件，调用修改数量函数，参数1表示增加
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        // 选择所有删除按钮
        btn.addEventListener('click', (e) => removeItem(e.target.dataset.id)); 
        // 为每个按钮添加点击事件，调用删除商品函数
    });
}

/**
 * 修改商品数量
 * @param {string} id - 商品ID
 * @param {number} change - 数量变化（+1/-1）
 */
function changeQuantity(id, change) {
    const item = cart.find(item => item.id === id); // 根据ID查找购物车中的商品
    if (item) { // 如果商品存在
        item.quantity += change; // 修改商品数量
        if (item.quantity <= 0) { // 如果修改后数量小于等于0
            removeItem(id); // 调用删除商品函数
        } else { // 如果数量大于0
            updateCart(); // 调用更新购物车显示函数
        }
    }
}

/**
 * 删除购物车商品
 * @param {string} id - 商品ID
 */
function removeItem(id) {
    cart = cart.filter(item => item.id !== id); 
    // 使用filter方法过滤掉指定ID的商品，返回新数组并赋值给cart
    updateCart(); // 调用更新购物车显示函数
}