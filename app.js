// 1. KẾT NỐI SUPABASE
const SUPABASE_URL = 'https://ldkwuvqzadkunzauzfvt.supabase.co'; // THAY BẰNG URL CỦA BẠN
const SUPABASE_KEY = 'sb_publishable_TTMQlwyRGeMX5xSs_UIM3g_gfl89Rfg'; // THAY BẰNG ANON KEY CỦA BẠN

// FIX: Sử dụng window.supabase để tránh lỗi xung đột biến
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- XỬ LÝ GIAO DIỆN (UI ROUTING) ---
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openCreatePostModal() { openModal('create-post-modal'); }
function openProfileModal() { openModal('profile-modal'); }

// --- LOGIC AUTH (ĐĂNG NHẬP / ĐĂNG KÝ) ---

// Gửi mã OTP xác minh (Đăng ký)
async function sendOTP() {
    const email = document.getElementById('reg-email').value;
    const pwd = document.getElementById('reg-password').value;
    const pwdConfirm = document.getElementById('reg-password-confirm').value;
    
    if (!email || !pwd) return alert('Vui lòng nhập đầy đủ thông tin!');
    if (pwd !== pwdConfirm) return alert('Mật khẩu không khớp!');
    
    const { data, error } = await supabaseClient.auth.signInWithOtp({
        email: email,
        options: { shouldCreateUser: true }
    });

    if (error) { 
        alert("Lỗi: " + error.message); 
    } else {
        document.getElementById('reg-step-1').classList.add('hidden');
        document.getElementById('reg-step-2').classList.remove('hidden');
    }
}

// Xác minh mã OTP 6 số
async function verifyRegister() {
    const email = document.getElementById('reg-email').value;
    const otp = document.getElementById('reg-otp').value;

    if (!otp) return alert('Vui lòng nhập mã xác minh!');

    const { data, error } = await supabaseClient.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
    });

    if (error) { 
        alert("Mã xác minh sai hoặc đã hết hạn!"); 
    } else {
        const name = document.getElementById('reg-name').value;
        await supabaseClient.from('profiles').update({ display_name: name }).eq('id', data.user.id);
        alert('Đăng ký thành công!');
        switchView('home-view');
    }
}

// Đăng nhập
async function login() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    
    if (!email || !pass) return alert('Vui lòng nhập email và mật khẩu!');

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
    
    if (error) {
        alert("Sai email hoặc mật khẩu");
    } else {
        switchView('home-view');
    }
}

// Đăng xuất
async function logout() {
    await supabaseClient.auth.signOut();
    closeModal('profile-modal');
    switchView('login-view');
}

// --- LOGIC BÀI VIẾT (POST) ---
async function submitPost() {
    const editor = document.getElementById('post-editor');
    const content = editor.innerHTML; 
    
    if (!content.trim()) return alert("Vui lòng nhập nội dung bài viết!");

    // Đoạn code mẫu để lưu vào Database khi bạn đã kết nối thành công:
    /*
    const { data: { user } } = await supabaseClient.auth.getUser();
    if(user) {
        const { error } = await supabaseClient.from('posts').insert([{ author_id: user.id, content: content }]);
        if (error) alert("Lỗi khi đăng bài: " + error.message);
    }
    */

    alert("Đã tiếp nhận bài viết!");
    editor.innerHTML = '';
    closeModal('create-post-modal');
}

// --- TÙY CHỈNH THEME ---
let isDarkMode = false;
function toggleTheme() {
    isDarkMode = !isDarkMode;
    const root = document.documentElement;
    if (isDarkMode) {
        root.style.setProperty('--bg-color', '#18191a');
        root.style.setProperty('--container-bg', '#242526');
        root.style.setProperty('--text-primary', '#e4e6eb');
        root.style.setProperty('--text-secondary', '#b0b3b8');
        root.style.setProperty('--border-color', '#3e4042');
    } else {
        root.style.setProperty('--bg-color', '#f8f9fa');
        root.style.setProperty('--container-bg', '#ffffff');
        root.style.setProperty('--text-primary', '#1c1e21');
        root.style.setProperty('--text-secondary', '#65676B');
        root.style.setProperty('--border-color', '#e4e6eb');
    }
}
