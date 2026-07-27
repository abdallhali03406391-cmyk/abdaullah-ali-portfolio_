 // ━━━ 1. إعداد وحساب Supabase ━━━
const SUPABASE_URL = "https://udhztdgnuklgqcoywcfq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_SfDX158Kv9094SF-e1VnoA_IrjH4YIY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ━━━ 2. متغيرات الأدمن والبيانات الأساسية ━━━
let isAdmin = false;

let aboutText = `<p>طالب في كلية الحاسبات والمعلومات (قسم IT) جامعة قنا.</p>`;
let skills = [];
let courses = [];
let projects = [];
let certificates = [];

// ━━━ 3. عناصر القوائم والروابط ━━━
const navItems = [
    { label: "الرئيسية", href: "#hero" },
    { label: "عني", href: "#about" },
    { label: "الكورسات", href: "#courses-section" },
    { label: "المشاريع", href: "#projects" },
    { label: "الشهادات", href: "#certificates" },
    { label: "تواصل", href: "#contact" }
];

const socialLinks = [
    { label: "GitHub", icon: "fab fa-github", url: "https://github.com/abdallhali03406391-cmyk" },
    { label: "Facebook", icon: "fab fa-facebook-f", url: "https://www.facebook.com/share/1AXuipkZiA/" },
    { label: "Email", icon: "mailto:abdallhali03406391@gmail.com" }
];

// ━━━ 4. إدارة مصادقة الأدمن (Supabase Auth) ━━━

async function loginAsAdmin(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert("⚠️ خطأ في تسجيل الدخول: " + error.message);
    } else {
        alert("✅ تم تسجيل الدخول كـ الأدمن بنجاح!");
        location.reload();
    }
}

function triggerAdminLogin() {
    const email = prompt("أدخل البريد الإلكتروني للأدمن:");
    if (!email) return;
    const password = prompt("أدخل كلمة السر:");
    if (!password) return;
    
    loginAsAdmin(email, password);
}

async function logoutAdmin() {
    await supabaseClient.auth.signOut();
    alert("تم تسجيل الخروج بنجاح");
    location.reload();
}

// ━━━ 5. جلب البيانات من Supabase ━━━

async function fetchAbout() {
    try {
        const { data, error } = await supabaseClient.from('about').select('*');
        if (!error && data && data.length > 0) {
            aboutText = data[data.length - 1].content;
        }
    } catch(e) { console.error("About fetch error:", e); }
    const aboutContainer = document.getElementById("about-text-container");
    if (aboutContainer) aboutContainer.innerHTML = aboutText;
}

async function fetchSkills() {
    try {
        const { data, error } = await supabaseClient.from('skills').select('*');
        if (!error && data) skills = data;
    } catch(e) { console.error("Skills fetch error:", e); }
    const skillsContainer = document.getElementById("skills-container");
    if (skillsContainer) skillsContainer.innerHTML = renderSkills(skills);
}

// 🎓 جلب قائمة الكورسات
async function fetchCourses() {
    try {
        const { data, error } = await supabaseClient.from('courses').select('*');
        if (!error && data) courses = data;
    } catch(e) { console.error("Courses fetch error:", e); }
    const coursesContainer = document.getElementById("courses-container");
    if (coursesContainer) coursesContainer.innerHTML = renderCourses(courses);
}

// 🖼️ جلب الصورة الجانبية لقسم الكورسات
async function fetchCoursesSideImg() {
    try {
        const { data, error } = await supabaseClient
            .from('profile')
            .select('courses_side_img')
            .eq('id', 1)
            .single();

        const coursesImg = document.getElementById("courses-side-img");
        if (!error && data && data.courses_side_img && coursesImg) {
            coursesImg.src = data.courses_side_img;
        }
    } catch(e) { console.error("Courses image fetch error:", e); }
}

async function fetchProjects() {
    try {
        const { data, error } = await supabaseClient.from('projects').select('*');
        if (!error && data) projects = data;
    } catch(e) { console.error("Projects fetch error:", e); }
    const projectsList = document.getElementById("projects-list");
    if (projectsList) projectsList.innerHTML = renderProjects(projects);
}

async function fetchCertificates() {
    try {
        const { data, error } = await supabaseClient.from('certificates').select('*');
        if (!error && data) certificates = data;
    } catch(e) { console.error("Certificates fetch error:", e); }
    const certGrid = document.getElementById("certificates-grid");
    if (certGrid) certGrid.innerHTML = renderCertificates(certificates);
}

// 📸 جلب رابط الصورة الشخصية المرفوعة في Supabase
async function fetchAvatar() {
    try {
        const { data, error } = await supabaseClient
            .from('profile')
            .select('avatar_url')
            .eq('id', 1)
            .single();

        const avatarImg = document.getElementById("user-avatar");
        if (!error && data && data.avatar_url && avatarImg) {
            avatarImg.src = data.avatar_url;
        }
    } catch(e) { console.error("Avatar fetch error:", e); }
}

// ━━━ 6. دالات بناء الواجهات (Render Functions) ━━━

function renderNav(items) {
    return items.map((item, i) => `
        <li>
            <a href="${item.href}" class="nav-link font-bold text-xs tracking-wide px-2 py-0.5 ${i === 0 ? 'active' : ''}" data-nav>${item.label}</a>
        </li>
    `).join("");
}

function renderSocial(items) {
    return items.map(s => `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="w-7.5 h-7.5 flex items-center justify-center rounded-full text-white bg-white/10 border border-white/20 hover:bg-white hover:text-[#800020] transition" aria-label="${s.label}">
            <i class="${s.icon} text-[11px]"></i>
        </a>
    `).join("");
}

function renderSkills(items) {
    return items.map((s) => `
        <span class="skill-tag px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700 shadow-sm flex items-center gap-1 relative group bg-slate-100">
            <i class="fas fa-check text-[9px] text-[#800020]"></i> ${s.name}
            ${isAdmin ? `<button onclick="deleteSkill('${s.id}')" class="text-red-400 hover:text-red-600 mr-1 text-[11px] font-bold" title="حذف">×</button>` : ''}
        </span>
    `).join("");
}

// 🎓 رسم الكورسات
function renderCourses(items) {
    if (!items || items.length === 0) {
        return `<div class="text-xs text-slate-400 py-2">لا توجد كورسات مضافة حتى الآن.</div>`;
    }

    return items.map((c) => `
        <div class="px-3 py-1.5 bg-[#800020]/5 border border-[#800020]/20 rounded-lg shadow-sm flex items-center gap-2 hover:bg-[#800020] hover:text-white transition-all duration-300 group">
            <span class="w-1.5 h-1.5 rounded-full bg-[#800020] group-hover:bg-white transition-colors"></span>
            <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-slate-800 group-hover:text-white transition-colors">${c.title}</span>
                ${c.issuer ? `<span class="text-[10px] text-[#800020] group-hover:text-pink-100 font-semibold transition-colors">(${c.issuer})</span>` : ''}
            </div>
            ${isAdmin ? `<button onclick="deleteCourse('${c.id}')" class="text-[#800020]/50 hover:text-red-500 group-hover:text-pink-200 mr-1 text-sm font-bold transition opacity-0 group-hover:opacity-100" title="حذف الكورس">×</button>` : ''}
        </div>
    `).join("");
}

// ━━━ دالة رسم المشاريع المعدلة (تتحكم في مصفوفة الصور المعادة من SQL ARRAY) ━━━
function renderProjects(items) {
    if (!items || items.length === 0) {
        return `<div class="text-center text-slate-400 py-8 bg-white rounded-xl border border-dashed border-slate-200 text-xs">لا توجد مشاريع مضافة حتى الآن.</div>`;
    }

    return items.map((proj, index) => {
        const tagsList = proj.tags ? proj.tags.split(',').map(t => t.trim()) : [];
        
        let mediaUrls = [];
        if (Array.isArray(proj.media_url)) {
            mediaUrls = proj.media_url;
        } else if (typeof proj.media_url === 'string' && proj.media_url.trim() !== '') {
            mediaUrls = proj.media_url.split(',').map(u => u.trim());
        }

        const mainMedia = mediaUrls[0] || '';
        
        let mediaHtml = "";
        
        if (proj.media_type === "video") {
            mediaHtml = `
                <video controls class="w-full h-full object-cover rounded-lg">
                    <source src="${mainMedia}" type="video/mp4">
                    متصفحك لا يدعم تشغيل الفيديو.
                </video>`;
        } else {
            mediaHtml = `
                <div class="w-full h-full flex flex-col gap-2">
                    <div class="w-full flex-1 overflow-hidden rounded-lg bg-slate-100 relative group min-h-[160px]">
                        <img id="main-project-img-${proj.id}" src="${mainMedia}" alt="${proj.title}" class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500" onclick="openLightbox(this.src)">
                    </div>
                    
                    ${mediaUrls.length > 1 ? `
                        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 max-h-14">
                            ${mediaUrls.map((url, imgIndex) => `
                                <img src="${url}" alt="صورة ${imgIndex + 1}" 
                                     class="w-10 h-10 object-cover rounded-md border-2 border-slate-200 hover:border-[#800020] cursor-pointer transition shrink-0" 
                                     onclick="changeMainProjectImage('${proj.id}', '${url}')">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>`;
        }

        return `
        <div class="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group">
            ${isAdmin ? `
            <button class="delete-project-btn absolute top-2.5 left-2.5 z-30 w-6 h-6 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition flex items-center justify-center" 
                    title="حذف المشروع" onclick="deleteProject('${proj.id}')">
                <i class="fas fa-trash-alt text-[10px]"></i>
            </button> ` : ''}

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 p-3.5 items-center">
                <div class="md:col-span-5 min-h-[220px] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative flex items-center justify-center p-1">
                    ${mediaHtml}
                </div>

                <div class="md:col-span-7 flex flex-col justify-between h-full space-y-2">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="bg-[#800020]/10 text-[#800020] font-bold text-[9px] px-2 py-0.5 rounded-full">مشروع #${index + 1}</span>
                            ${mediaUrls.length > 1 ? `<span class="bg-slate-100 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded-full">📷 ${mediaUrls.length} صور</span>` : ''}
                        </div>
                        <h3 class="text-sm font-bold text-slate-800 hover:text-[#800020] transition">${proj.title}</h3>
                        <p class="text-[11px] text-slate-600 leading-relaxed mt-1 line-clamp-3">${proj.description}</p>
                    </div>

                    <div class="flex flex-wrap gap-1 pt-1.5 border-t border-slate-100">
                        ${tagsList.map(tag => `<span class="bg-slate-100 text-slate-700 font-semibold text-[9px] px-1.5 py-0.5 rounded">${tag}</span>`).join('')}
                    </div>

                    <div class="flex items-center gap-2 pt-1">
                        ${proj.demo_url ? `<a href="${proj.demo_url}" target="_blank" class="px-3 py-1 bg-[#800020] hover:bg-[#600018] text-white font-bold rounded-md text-[11px] shadow-sm flex items-center gap-1 transition"><i class="fas fa-external-link-alt text-[9px]"></i> معاينة</a>` : ''}
                        ${proj.github_url ? `<a href="${proj.github_url}" target="_blank" class="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-md text-[11px] shadow-sm flex items-center gap-1 transition"><i class="fab fa-github text-[10px]"></i> GitHub</a>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }).join("");
}

// تغيير الصورة الرئيسية من الكروت المصغرة
function changeMainProjectImage(projId, newUrl) {
    const mainImg = document.getElementById(`main-project-img-${projId}`);
    if (mainImg) {
        mainImg.src = newUrl;
    }
}

function renderCertificates(items) {
    let html = "";
    if (items && items.length > 0) {
        html += items.map((cert, index) => `
            <article class="cert-card rounded-lg overflow-hidden relative bg-white border border-slate-200">
                ${isAdmin ? `
                <button class="delete-cert-btn absolute top-2 left-2 z-20 w-6 h-6 rounded-full flex items-center justify-center text-red-500 bg-white/80 shadow-md" title="حذف الشهادة" onclick="deleteCertificate('${cert.id}')">
                    <i class="fas fa-trash-alt text-[10px]"></i>
                </button> ` : ''}

                <div class="w-full h-44 overflow-hidden relative group cursor-pointer" onclick="openLightbox('${cert.image_url}')">
                    <img src="${cert.image_url}" alt="${cert.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                </div>
                
                <div class="p-2 flex flex-col justify-between flex-grow">
                    <div class="flex items-center justify-between gap-1">
                        <span class="badge bg-[#800020]/10 text-[#800020] px-1.5 py-0.1 rounded text-[8px] font-bold">${cert.category || 'عام'}</span>
                        <span class="text-[8px] text-slate-400 font-bold">#${index + 1}</span>
                    </div>
                    <h3 class="text-xs font-bold text-slate-800 line-clamp-1">${cert.title}</h3>
                    <div class="pt-1.5 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400">
                        <span><i class="fas fa-university ml-1 text-[#800020]"></i>${cert.issuer}</span>
                        <span>📅 ${cert.date}</span>
                    </div>
                </div>
            </article>
        `).join("");
    } else if (!isAdmin) {
        html = `<div class="col-span-full text-center text-slate-400 py-6 text-xs">لم يتم إضافة شهادات حتى الآن.</div>`;
    }

    if (isAdmin) {
        html += `
            <div id="trigger-add-modal" class="cert-card border-2 border-dashed border-[#800020]/40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#800020]/5 transition-all duration-300 min-h-[270px]">
                <div class="w-12 h-12 rounded-full bg-[#800020]/10 flex items-center justify-center mb-2 text-[#800020]">
                    <i class="fas fa-plus text-xl"></i>
                </div>
                <span class="text-xs font-bold text-[#800020]">إضافة شهادة جديدة</span>
            </div>`;
    }

    return html;
}

function renderContactLinks(items) {
    return items.map(s => `
        <a href="${s.url}" target="_blank" class="social-icon-public flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm bg-white border border-slate-200 hover:bg-[#800020] hover:text-white transition">
            <i class="${s.icon} text-xs"></i>
            <span class="text-[10px] font-bold">${s.label}</span>
        </a>
    `).join("");
}

// ━━━ 7. عمليات الحذف ━━━

async function deleteSkill(id) {
    if (confirm("هل تريد حذف هذه المهارة؟")) {
        const { error } = await supabaseClient.from('skills').delete().eq('id', id);
        if (error) alert("خطأ بالحذف: " + error.message);
        else fetchSkills();
    }
}

async function deleteCourse(id) {
    if (confirm("هل تريد حذف هذا الكورس؟")) {
        const { error } = await supabaseClient.from('courses').delete().eq('id', id);
        if (error) alert("خطأ بالحذف: " + error.message);
        else fetchCourses();
    }
}

async function deleteProject(id) {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا المشروع؟")) {
        const { error } = await supabaseClient.from('projects').delete().eq('id', id);
        if (error) alert("خطأ بالحذف: " + error.message);
        else fetchProjects();
    }
}

async function deleteCertificate(id) {
    if (confirm("هل أنت متأكد من حذف هذه الشهادة؟")) {
        const { error } = await supabaseClient.from('certificates').delete().eq('id', id);
        if (error) alert("خطأ بالحذف: " + error.message);
        else fetchCertificates();
    }
}

// ━━━ 8. الأحداث الرئيسية وعمليات الإضافة عند تحميل الصفحة ━━━

document.addEventListener("DOMContentLoaded", async function() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    isAdmin = user !== null;

    const avatarImg = document.getElementById("user-avatar");
    const changeAvatarBtn = document.getElementById("change-avatar-btn");
    const avatarInput = document.getElementById("avatar-input");

    fetchAvatar();

    if (isAdmin && changeAvatarBtn) {
        changeAvatarBtn.classList.remove("hidden");
    }

    if (avatarInput) {
        avatarInput.addEventListener("change", async function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const originalText = changeAvatarBtn.innerHTML;
            changeAvatarBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> جاري الرفع...`;
            changeAvatarBtn.style.pointerEvents = "none";

            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `avatar_${Date.now()}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabaseClient
                    .storage
                    .from('profile_photo')
                    .upload(fileName, file, { upsert: true });

                if (uploadError) throw uploadError;

                const { data: urlData } = supabaseClient
                    .storage
                    .from('profile_photo')
                    .getPublicUrl(fileName);

                const publicUrl = urlData.publicUrl;

                const { error: dbError } = await supabaseClient
                    .from('profile')
                    .upsert({ id: 1, avatar_url: publicUrl });

                if (dbError) throw dbError;

                if (avatarImg) avatarImg.src = publicUrl;
                alert("✅ تم رفع الصورة وتحديثها بنجاح!");

            } catch (err) {
                console.error(err);
                alert("⚠️ حدث خطأ أثناء رفع الصورة: " + err.message);
            } finally {
                changeAvatarBtn.innerHTML = originalText;
                changeAvatarBtn.style.pointerEvents = "auto";
                avatarInput.value = "";
            }
        });
    }

    const desktopNav = document.getElementById("desktop-nav");
    const mobileNavList = document.getElementById("mobile-nav-list");
    if (desktopNav) desktopNav.innerHTML = renderNav(navItems);
    if (mobileNavList) mobileNavList.innerHTML = renderNav(navItems);

    const desktopSocial = document.getElementById("desktop-social");
    const mobileSocial = document.getElementById("mobile-social");
    if (desktopSocial) desktopSocial.innerHTML = renderSocial(socialLinks);
    if (mobileSocial) mobileSocial.innerHTML = renderSocial(socialLinks);

    const contactLinks = document.getElementById("contact-links");
    if (contactLinks) contactLinks.innerHTML = renderContactLinks(socialLinks);

    await Promise.all([
        fetchAbout(), 
        fetchSkills(), 
        fetchCourses(), 
        fetchCoursesSideImg(), 
        fetchProjects(), 
        fetchCertificates()
    ]);

    if (isAdmin) {
        const editAboutBtn = document.getElementById("edit-about-btn");
        const addSkillForm = document.getElementById("add-skill-form");
        const addCourseForm = document.getElementById("add-course-form");
        const changeCoursesImgBtn = document.getElementById("change-courses-img-btn");

        if (editAboutBtn) editAboutBtn.classList.remove("hidden");
        if (addSkillForm) addSkillForm.classList.remove("hidden");
        if (addCourseForm) addCourseForm.classList.remove("hidden");
        if (changeCoursesImgBtn) changeCoursesImgBtn.classList.remove("hidden");

        const adminProjectBtnWrapper = document.getElementById("admin-add-project-wrapper");
        if (adminProjectBtnWrapper) {
            adminProjectBtnWrapper.innerHTML = `
                <button id="trigger-add-project" class="px-3 py-1.5 bg-[#800020] text-white text-xs font-bold rounded-lg shadow hover:bg-[#600018] transition flex items-center gap-1.5">
                    <i class="fas fa-plus"></i> إضافة مشروع
                </button>
            `;
        }
    }

    const editAboutBtn = document.getElementById("edit-about-btn");
    if (editAboutBtn) {
        editAboutBtn.addEventListener("click", async function() {
            const currentText = document.getElementById("about-text-container").innerText;
            const newText = prompt("قم بتعديل نبذة عني:", currentText);
            if (newText !== null && newText.trim() !== "") {
                const formattedText = `<p>${newText.trim()}</p>`;
                const { error } = await supabaseClient.from('about').insert([{ content: formattedText }]);
                if (error) alert("خطأ في تعديل نبذة عني: " + error.message);
                else fetchAbout();
            }
        });
    }

    const addSkillForm = document.getElementById("add-skill-form");
    if (addSkillForm) {
        addSkillForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const skillInput = document.getElementById("skill-input");
            const newSkill = skillInput.value.trim();
            if (newSkill) {
                const { error } = await supabaseClient.from('skills').insert([{ name: newSkill }]);
                if (error) alert("خطأ في إضافة المهارة: " + error.message);
                else {
                    fetchSkills();
                    skillInput.value = "";
                }
            }
        });
    }

    const addCourseForm = document.getElementById("add-course-form");
    if (addCourseForm) {
        addCourseForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const nameInput = document.getElementById("course-name-input");
            const issuerInput = document.getElementById("course-issuer-input");

            const courseTitle = nameInput.value.trim();
            const courseIssuer = issuerInput.value.trim();

            if (courseTitle) {
                const { error } = await supabaseClient.from('courses').insert([{
                    title: courseTitle,
                    issuer: courseIssuer
                }]);

                if (error) {
                    alert("خطأ في إضافة الكورس: " + error.message);
                } else {
                    fetchCourses();
                    nameInput.value = "";
                    issuerInput.value = "";
                }
            }
        });
    }

    const coursesImgInput = document.getElementById("courses-img-input");
    const changeCoursesImgBtn = document.getElementById("change-courses-img-btn");
    const coursesSideImg = document.getElementById("courses-side-img");

    if (coursesImgInput) {
        coursesImgInput.addEventListener("change", async function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const originalText = changeCoursesImgBtn.innerHTML;
            changeCoursesImgBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> جاري الرفع...`;
            changeCoursesImgBtn.style.pointerEvents = "none";

            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `courses_side_${Date.now()}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabaseClient
                    .storage
                    .from('profile_photo')
                    .upload(fileName, file, { upsert: true });

                if (uploadError) throw uploadError;

                const { data: urlData } = supabaseClient
                    .storage
                    .from('profile_photo')
                    .getPublicUrl(fileName);

                const publicUrl = urlData.publicUrl;

                const { error: dbError } = await supabaseClient
                    .from('profile')
                    .upsert({ id: 1, courses_side_img: publicUrl });

                if (dbError) throw dbError;

                if (coursesSideImg) coursesSideImg.src = publicUrl;
                alert("✅ تم رفع وتحديث صورة قسم الكورسات بنجاح!");

            } catch (err) {
                console.error(err);
                alert("⚠️ حدث خطأ أثناء رفع الصورة: " + err.message);
            } finally {
                changeCoursesImgBtn.innerHTML = originalText;
                changeCoursesImgBtn.style.pointerEvents = "auto";
                coursesImgInput.value = "";
            }
        });
    }

    // ━━━ إضافة مشروع جديد بفرز ورفع مصفوفة ملفات لـ Supabase ━━━
    const addProjectForm = document.getElementById("add-project-form");
    if (addProjectForm) {
        addProjectForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById("submit-project-btn");
            const originalBtnText = submitBtn.innerText;
            
            const title = document.getElementById("project-title").value;
            const mediaType = document.getElementById("project-media-type").value;
            const fileInput = document.getElementById("project-media-file");
            const desc = document.getElementById("project-desc").value;
            const tags = document.getElementById("project-tags").value;
            const demo = document.getElementById("project-demo").value;
            const github = document.getElementById("project-github").value;

            const files = Array.from(fileInput.files);
            if (files.length === 0) {
                alert("يرجى اختيار ملف الميديا من جهازك أولاً!");
                return;
            }

            if (files.length > 10) {
                alert("⚠️ يُسمح برفع 10 صور كحد أقصى للمشروع الواحد!");
                return;
            }

            try {
                submitBtn.disabled = true;
                const uploadedUrls = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    submitBtn.innerText = `جاري رفع الملف (${i + 1}/${files.length})...`;

                    const fileExt = file.name.split('.').pop();
                    const fileName = `proj_${Date.now()}_${i}.${fileExt}`;

                    const { data: uploadData, error: uploadError } = await supabaseClient
                        .storage
                        .from('project_media')
                        .upload(fileName, file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabaseClient
                        .storage
                        .from('project_media')
                        .getPublicUrl(fileName);

                    uploadedUrls.push(urlData.publicUrl);
                }

                submitBtn.innerText = "جاري حفظ بيانات المشروع...";

                // حفظ الـ Array المحدثة لحقل media_url (text[])
                const { error: dbError } = await supabaseClient.from('projects').insert([{
                    title: title,
                    media_type: mediaType,
                    media_url: uploadedUrls,
                    description: desc,
                    tags: tags,
                    demo_url: demo,
                    github_url: github
                }]);

                if (dbError) throw dbError;

                alert("✅ تم رفع الملفات وحفظ المشروع بنجاح!");
                fetchProjects();
                addProjectForm.reset();
                document.getElementById("add-project-modal").classList.add("hidden");

            } catch (err) {
                console.error(err);
                alert("⚠️ حدث خطأ أثناء رفع المشروع: " + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }

    // ━━━ إضافة شهادة جديدة ━━━
    const addCertForm = document.getElementById("add-cert-form");
    if (addCertForm) {
        addCertForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById("submit-cert-btn");
            const originalBtnText = submitBtn.innerText;

            const title = document.getElementById("cert-title").value;
            const platform = document.getElementById("cert-platform").value;
            const date = document.getElementById("cert-date").value;
            const category = document.getElementById("cert-category").value;
            const fileInput = document.getElementById("cert-img-file");

            const file = fileInput.files[0];
            if (!file) {
                alert("يرجى اختيار صورة الشهادة من جهازك أولاً!");
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.innerText = "جاري رفع الصورة...";

                const fileExt = file.name.split('.').pop();
                const fileName = `cert_${Date.now()}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabaseClient
                    .storage
                    .from('certificate_images')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabaseClient
                    .storage
                    .from('certificate_images')
                    .getPublicUrl(fileName);

                const imgUrl = urlData.publicUrl;

                const { error: dbError } = await supabaseClient.from('certificates').insert([{
                    title: title,
                    issuer: platform,
                    date: date,
                    category: category,
                    image_url: imgUrl
                }]);

                if (dbError) throw dbError;

                alert("✅ تم رفع صورة الشهادة وحفظها بنجاح!");
                fetchCertificates();
                addCertForm.reset();
                document.getElementById("add-cert-modal").classList.add("hidden");

            } catch (err) {
                console.error(err);
                alert("⚠️ حدث خطأ أثناء رفع الشهادة: " + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }
});

// ━━━ 9. إدارة المودالات والنافذة المنبثقة ━━━

function openLightbox(imgUrl) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    if (modal && modalImg) { modalImg.src = imgUrl; modal.classList.remove("hidden"); }
}

document.addEventListener("click", function(e) {
    if (e.target.closest("#trigger-add-project")) {
        const projectModal = document.getElementById("add-project-modal");
        if (projectModal) projectModal.classList.remove("hidden");
    }
    if (e.target.closest("#close-project-modal") || e.target.closest("#cancel-project-add")) {
        document.getElementById("add-project-modal").classList.add("hidden");
    }

    if (e.target.closest("#trigger-add-modal")) {
        const addModal = document.getElementById("add-cert-modal");
        if (addModal) addModal.classList.remove("hidden");
    }
    if (e.target.closest("#close-add-modal") || e.target.closest("#cancel-add")) {
        document.getElementById("add-cert-modal").classList.add("hidden");
    }

    if (e.target.closest("#close-modal") || e.target === document.getElementById("image-modal")) {
        document.getElementById("image-modal").classList.add("hidden");
    }
});
