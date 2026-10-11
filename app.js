// Thay bằng URL và ANON KEY của bạn lấy từ Supabase
const SUPABASE_URL = 'https://ldkwuvqzadkunzauzfvt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_TTMQlwyRGeMX5xSs_UIM3g_gfl89Rfg'; 
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

// 1. Gửi mã OTP xác minh (Đăng ký)
async function sendOTP() {
    const email = document.getElementById('reg-email').value;
    const pwd = document.getElementById('reg-password').value;
    const pwdConfirm = document.getElementById('reg-password-confirm').value;
    
    if (pwd !== pwdConfirm) return alert('Mật khẩu không khớp!');
    
    // Yêu cầu Supabase gửi mã OTP 6 số
    const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: { shouldCreateUser: true }
    });

    if (error) { alert(error.message); } 
    else {
        document.getElementById('reg-step-1').classList.add('hidden');
        document.getElementById('reg-step-2').classList.remove('hidden');
    }
}

// 2. Xác minh mã OTP 6 số
async function verifyRegister() {
    const email = document.getElementById('reg-email').value;
    const otp = document.getElementById('reg-otp').value;

    const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
    });

    if (error) { alert("Mã xác minh sai!"); } 
    else {
        // Cập nhật Tên hiển thị (Display Name) vào bảng profiles
        const name = document.getElementById('reg-name').value;
        await supabase.from('profiles').update({ display_name: name }).eq('id', data.user.id);
        alert('Đăng ký thành công!');
        switchView('home-view');
    }
}

// 3. Đăng nhập
async function login() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    
    if (error) alert("Sai email hoặc mật khẩu");
    else switchView('home-view');
}

// 4. Đăng xuất
async function logout() {
    await supabase.auth.signOut();
    closeModal('profile-modal');
    switchView('login-view');
}

// --- LOGIC BÀI VIẾT (POST) ---

async function submitPost() {
    const editor = document.getElementById('post-editor');
    const content = editor.innerHTML; // Lấy cả định dạng in đậm, in nghiêng (HTML)
    
    // Gọi API Supabase để Insert vào bảng posts (Yêu cầu user đã đăng nhập)
    /* 
    const user = (await supabase.auth.getUser()).data.user;
    await supabase.from('posts').insert([
        { author_id: user.id, content: content }
    ]);
    */
    
    alert("Đã đăng bài!");
    editor.innerHTML = '';
    closeModal('create-post-modal');
    // fetchPosts(); // Load lại bảng tin
}

// --- TÙY CHỈNH THEME ---
let isDarkMode = false;
function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.documentElement.style.setProperty('--bg-color', '#18191a');
        document.documentElement.style.setProperty('--container-bg', '#242526');
        document.documentElement.style.setProperty('--text-primary', '#e4e6eb');
        document.documentElement.style.setProperty('--text-secondary', '#b0b3b8');
        document.documentElement.style.setProperty('--border-color', '#3e4042');
    } else {
        document.documentElement.style.setProperty('--bg-color', '#f8f9fa');
        document.documentElement.style.setProperty('--container-bg', '#ffffff');
        document.documentElement.style.setProperty('--text-primary', '#1c1e21');
        document.documentElement.style.setProperty('--text-secondary', '#65676B');
        document.documentElement.style.setProperty('--border-color', '#e4e6eb');
    }
}
