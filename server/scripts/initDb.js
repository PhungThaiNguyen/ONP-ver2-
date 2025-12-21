/**
 * Script khởi tạo Database với dữ liệu đầy đủ
 * Chạy: npm run init-db
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const DB_PATH = path.join(dataDir, 'onp.sqlite');

// Xóa database cũ nếu tồn tại
if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log('🗑️  Deleted old database');
}

const db = new sqlite3.Database(DB_PATH);

console.log('🚀 Đang khởi tạo database...');

db.serialize(() => {
    // ==========================================
    // Tạo bảng PRODUCTS
    // ==========================================
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_ja TEXT NOT NULL,
            name_en TEXT,
            name_vi TEXT,
            material TEXT DEFAULT 'brass',
            material_ja TEXT,
            material_en TEXT,
            material_vi TEXT,
            size TEXT,
            tolerance TEXT,
            surface_ja TEXT,
            surface_en TEXT,
            surface_vi TEXT,
            process_ja TEXT,
            process_en TEXT,
            process_vi TEXT,
            image TEXT,
            images TEXT,
            is_featured INTEGER DEFAULT 0,
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ==========================================
    // Tạo bảng NEWS
    // ==========================================
    db.run(`
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title_ja TEXT NOT NULL,
            title_en TEXT,
            title_vi TEXT,
            date_ja TEXT,
            date_en TEXT,
            date_vi TEXT,
            excerpt_ja TEXT,
            excerpt_en TEXT,
            excerpt_vi TEXT,
            content_ja TEXT,
            content_en TEXT,
            content_vi TEXT,
            category TEXT DEFAULT 'info',
            image TEXT,
            published_at DATE,
            is_published INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ==========================================
    // DỮ LIỆU PRODUCTS (16 sản phẩm)
    // ==========================================
    const products = [
        {
            name_ja: "真鍮製 精密コネクタ部品",
            name_en: "Brass Precision Connector Parts",
            name_vi: "Linh kiện đầu nối chính xác bằng đồng thau",
            material: "brass",
            material_ja: "真鍮 (C3604)",
            material_en: "Brass (C3604)",
            material_vi: "Đồng thau (C3604)",
            size: "φ5.0 × L15.0mm",
            tolerance: "±0.01mm",
            surface_ja: "ニッケルメッキ",
            surface_en: "Nickel Plating",
            surface_vi: "Mạ niken",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-01.png",
            is_featured: 1
        },
        {
            name_ja: "ステンレス製 シャフト加工品",
            name_en: "Stainless Steel Shaft",
            name_vi: "Trục gia công bằng thép không gỉ",
            material: "stainless",
            material_ja: "ステンレス (SUS304)",
            material_en: "Stainless Steel (SUS304)",
            material_vi: "Thép không gỉ (SUS304)",
            size: "φ8.0 × L50.0mm",
            tolerance: "±0.005mm",
            surface_ja: "鏡面仕上げ",
            surface_en: "Mirror Finish",
            surface_vi: "Hoàn thiện gương",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-02.png",
            is_featured: 1
        },
        {
            name_ja: "真鍮製 精密ピン加工品",
            name_en: "Brass Precision Pin",
            name_vi: "Pin chính xác bằng đồng thau",
            material: "brass",
            material_ja: "真鍮 (C3604)",
            material_en: "Brass (C3604)",
            material_vi: "Đồng thau (C3604)",
            size: "φ2.0 × L20.0mm",
            tolerance: "±0.01mm",
            surface_ja: "金メッキ",
            surface_en: "Gold Plating",
            surface_vi: "Mạ vàng",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-03.png",
            is_featured: 1
        },
        {
            name_ja: "アルミ製 リング加工品",
            name_en: "Aluminum Ring",
            name_vi: "Vòng gia công bằng nhôm",
            material: "aluminum",
            material_ja: "アルミ (A6061)",
            material_en: "Aluminum (A6061)",
            material_vi: "Nhôm (A6061)",
            size: "φ30.0 × φ20.0 × L10.0mm",
            tolerance: "±0.02mm",
            surface_ja: "アルマイト処理",
            surface_en: "Anodizing",
            surface_vi: "Anodize",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-04.png",
            is_featured: 1
        },
        {
            name_ja: "真鍮製 バルブシート",
            name_en: "Brass Valve Seat",
            name_vi: "Đế van bằng đồng thau",
            material: "brass",
            material_ja: "真鍮 (C3604)",
            material_en: "Brass (C3604)",
            material_vi: "Đồng thau (C3604)",
            size: "φ12.0 × L8.0mm",
            tolerance: "±0.01mm",
            surface_ja: "ニッケルメッキ",
            surface_en: "Nickel Plating",
            surface_vi: "Mạ niken",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-05.png",
            is_featured: 1
        },
        {
            name_ja: "ステンレス製 精密ノズル",
            name_en: "Stainless Steel Precision Nozzle",
            name_vi: "Vòi phun chính xác bằng thép không gỉ",
            material: "stainless",
            material_ja: "ステンレス (SUS316)",
            material_en: "Stainless Steel (SUS316)",
            material_vi: "Thép không gỉ (SUS316)",
            size: "φ6.0 × L25.0mm",
            tolerance: "±0.005mm",
            surface_ja: "電解研磨",
            surface_en: "Electrolytic Polishing",
            surface_vi: "Đánh bóng điện phân",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-06.png",
            is_featured: 1
        },
        {
            name_ja: "真鍮製 電気接点部品",
            name_en: "Brass Electrical Contact Parts",
            name_vi: "Linh kiện tiếp điểm điện bằng đồng thau",
            material: "brass",
            material_ja: "真鍮 (C2680)",
            material_en: "Brass (C2680)",
            material_vi: "Đồng thau (C2680)",
            size: "φ4.0 × L12.0mm",
            tolerance: "±0.01mm",
            surface_ja: "銀メッキ",
            surface_en: "Silver Plating",
            surface_vi: "Mạ bạc",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-07.png",
            is_featured: 0
        },
        {
            name_ja: "アルミ製 スペーサー",
            name_en: "Aluminum Spacer",
            name_vi: "Miếng đệm bằng nhôm",
            material: "aluminum",
            material_ja: "アルミ (A5052)",
            material_en: "Aluminum (A5052)",
            material_vi: "Nhôm (A5052)",
            size: "φ15.0 × φ8.0 × L5.0mm",
            tolerance: "±0.02mm",
            surface_ja: "アルマイト処理（黒）",
            surface_en: "Anodizing (Black)",
            surface_vi: "Anodize (đen)",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-08.png",
            is_featured: 0
        },
        {
            name_ja: "ステンレス製 精密シャフト",
            name_en: "Stainless Steel Precision Shaft",
            name_vi: "Trục chính xác bằng thép không gỉ",
            material: "stainless",
            material_ja: "ステンレス (SUS303)",
            material_en: "Stainless Steel (SUS303)",
            material_vi: "Thép không gỉ (SUS303)",
            size: "φ6.0 × L80.0mm",
            tolerance: "±0.005mm",
            surface_ja: "鏡面仕上げ",
            surface_en: "Mirror Finish",
            surface_vi: "Hoàn thiện gương",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-09.png",
            is_featured: 0
        },
        {
            name_ja: "真鍮製 フィッティング部品",
            name_en: "Brass Fitting Parts",
            name_vi: "Linh kiện lắp ráp bằng đồng thau",
            material: "brass",
            material_ja: "真鍮 (C3604)",
            material_en: "Brass (C3604)",
            material_vi: "Đồng thau (C3604)",
            size: "φ10.0 × L18.0mm",
            tolerance: "±0.01mm",
            surface_ja: "クロムメッキ",
            surface_en: "Chrome Plating",
            surface_vi: "Mạ chrome",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-10.png",
            is_featured: 0
        },
        {
            name_ja: "真鍮製 ニップル加工品",
            name_en: "Brass Nipple",
            name_vi: "Núm nối bằng đồng thau",
            material: "brass",
            material_ja: "真鍮 (C3604)",
            material_en: "Brass (C3604)",
            material_vi: "Đồng thau (C3604)",
            size: "φ8.0 × L22.0mm",
            tolerance: "±0.01mm",
            surface_ja: "ニッケルメッキ",
            surface_en: "Nickel Plating",
            surface_vi: "Mạ niken",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-11.png",
            is_featured: 0
        },
        {
            name_ja: "ステンレス製 精密ブッシュ",
            name_en: "Stainless Steel Precision Bush",
            name_vi: "Bạc lót chính xác bằng thép không gỉ",
            material: "stainless",
            material_ja: "ステンレス (SUS304)",
            material_en: "Stainless Steel (SUS304)",
            material_vi: "Thép không gỉ (SUS304)",
            size: "φ12.0 × φ8.0 × L15.0mm",
            tolerance: "±0.005mm",
            surface_ja: "バフ仕上げ",
            surface_en: "Buff Finish",
            surface_vi: "Đánh bóng buff",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-12.png",
            is_featured: 0
        },
        {
            name_ja: "真鍮製 精密カラー",
            name_en: "Brass Precision Collar",
            name_vi: "Vòng cổ chính xác bằng đồng thau",
            material: "brass",
            material_ja: "真鍮 (C3604)",
            material_en: "Brass (C3604)",
            material_vi: "Đồng thau (C3604)",
            size: "φ10.0 × φ6.0 × L8.0mm",
            tolerance: "±0.01mm",
            surface_ja: "ニッケルメッキ",
            surface_en: "Nickel Plating",
            surface_vi: "Mạ niken",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-13.png",
            is_featured: 0
        },
        {
            name_ja: "アルミ製 精密加工品",
            name_en: "Aluminum Precision Parts",
            name_vi: "Sản phẩm gia công chính xác bằng nhôm",
            material: "aluminum",
            material_ja: "アルミ (A7075)",
            material_en: "Aluminum (A7075)",
            material_vi: "Nhôm (A7075)",
            size: "φ20.0 × L30.0mm",
            tolerance: "±0.01mm",
            surface_ja: "硬質アルマイト",
            surface_en: "Hard Anodizing",
            surface_vi: "Anodize cứng",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-14.png",
            is_featured: 0
        },
        {
            name_ja: "ステンレス製 パイプ加工品",
            name_en: "Stainless Steel Pipe",
            name_vi: "Ống gia công bằng thép không gỉ",
            material: "stainless",
            material_ja: "ステンレス (SUS316L)",
            material_en: "Stainless Steel (SUS316L)",
            material_vi: "Thép không gỉ (SUS316L)",
            size: "φ10.0 × φ8.0 × L40.0mm",
            tolerance: "±0.01mm",
            surface_ja: "電解研磨",
            surface_en: "Electrolytic Polishing",
            surface_vi: "Đánh bóng điện phân",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-15.png",
            is_featured: 0
        },
        {
            name_ja: "真鍮製 コネクタハウジング",
            name_en: "Brass Connector Housing",
            name_vi: "Vỏ đầu nối bằng đồng thau",
            material: "brass",
            material_ja: "真鍮 (C3604)",
            material_en: "Brass (C3604)",
            material_vi: "Đồng thau (C3604)",
            size: "φ8.0 × L20.0mm",
            tolerance: "±0.01mm",
            surface_ja: "金メッキ",
            surface_en: "Gold Plating",
            surface_vi: "Mạ vàng",
            process_ja: "NC自動旋盤加工",
            process_en: "NC Automatic Lathe",
            process_vi: "Gia công tiện tự động NC",
            image: "./assets/images/products/product-16.png",
            is_featured: 0
        }
    ];

    const insertProduct = db.prepare(`
        INSERT INTO products (
            name_ja, name_en, name_vi,
            material, material_ja, material_en, material_vi,
            size, tolerance,
            surface_ja, surface_en, surface_vi,
            process_ja, process_en, process_vi,
            image, is_featured, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    products.forEach((p, i) => {
        insertProduct.run(
            p.name_ja, p.name_en, p.name_vi,
            p.material, p.material_ja, p.material_en, p.material_vi,
            p.size, p.tolerance,
            p.surface_ja, p.surface_en, p.surface_vi,
            p.process_ja, p.process_en, p.process_vi,
            p.image, p.is_featured, i + 1
        );
    });
    insertProduct.finalize();
    console.log(`✅ Đã thêm ${products.length} sản phẩm`);

    // ==========================================
    // DỮ LIỆU NEWS (3 tin tức)
    // ==========================================
    const news = [
        {
            title_ja: "第二工場を増築しました",
            title_en: "Expanded Second Factory",
            title_vi: "Đã mở rộng nhà máy thứ hai",
            date_ja: "2023年03月24日（金）",
            date_en: "March 24, 2023 (Fri)",
            date_vi: "24/03/2023 (Thứ 6)",
            excerpt_ja: "O.N.Precision本社に隣接する第二工場を増築いたしました。これにより、生産ラインの拡充と効率化を図ります。",
            excerpt_en: "We have expanded our second factory adjacent to O.N.Precision headquarters.",
            excerpt_vi: "Chúng tôi đã mở rộng nhà máy thứ hai liền kề với trụ sở chính của O.N.Precision.",
            content_ja: `<p>O.N.Precision本社に隣接する第二工場を増築いたしました。これにより、生産ラインの拡充と効率化を図り、お客様のニーズにより迅速にお応えできる体制を整えました。</p>
<h2>増築の概要</h2>
<ul>
<li>延床面積：約500㎡増加</li>
<li>新規NC自動旋盤：5台導入</li>
<li>検査設備の拡充</li>
</ul>
<p>今後も精密加工のプロフェッショナルとして、高品質な製品をお届けしてまいります。お気軽にお問い合わせください。</p>`,
            content_en: `<p>We have expanded our second factory adjacent to O.N.Precision headquarters. This expansion has enhanced our production lines and efficiency, enabling us to respond more quickly to customer needs.</p>
<h2>Expansion Overview</h2>
<ul>
<li>Floor area: Approximately 500㎡ increase</li>
<li>New NC automatic lathes: 5 units installed</li>
<li>Expanded inspection equipment</li>
</ul>
<p>We will continue to deliver high-quality products as professionals in precision machining. Please feel free to contact us.</p>`,
            content_vi: `<p>Chúng tôi đã mở rộng nhà máy thứ hai liền kề với trụ sở chính của O.N.Precision. Việc mở rộng này đã nâng cao dây chuyền sản xuất và hiệu quả, cho phép chúng tôi đáp ứng nhanh hơn nhu cầu của khách hàng.</p>
<h2>Tổng quan về việc mở rộng</h2>
<ul>
<li>Diện tích sàn: Tăng khoảng 500㎡</li>
<li>Máy tiện tự động NC mới: 5 máy được lắp đặt</li>
<li>Mở rộng thiết bị kiểm tra</li>
</ul>
<p>Chúng tôi sẽ tiếp tục cung cấp sản phẩm chất lượng cao với tư cách là chuyên gia gia công chính xác. Vui lòng liên hệ với chúng tôi.</p>`,
            image: "./assets/images/company/building-01.png",
            published_at: "2023-03-24"
        },
        {
            title_ja: "NC自動旋盤設備に投資しました",
            title_en: "Invested in NC Automatic Lathe Equipment",
            title_vi: "Đã đầu tư thiết bị máy tiện tự động NC",
            date_ja: "2024年02月09日（金）",
            date_en: "February 9, 2024 (Fri)",
            date_vi: "09/02/2024 (Thứ 6)",
            excerpt_ja: "生産能力拡大のため、2024年2月にNC自動旋盤を追加導入いたしました。",
            excerpt_en: "To expand production capacity, we added NC automatic lathes in February 2024.",
            excerpt_vi: "Để mở rộng năng lực sản xuất, chúng tôi đã bổ sung máy tiện tự động NC vào tháng 2/2024.",
            content_ja: `<p>生産能力拡大のため、2024年2月にNC自動旋盤を追加導入いたしました。最新鋭の設備により、より高精度かつ効率的な加工が可能となりました。</p>
<h2>導入設備</h2>
<ul>
<li>スター精密製 SR-20</li>
<li>シチズンマシナリー製 L12</li>
<li>加工径：φ3～φ20対応</li>
</ul>
<p>2024年も引き続き設備投資を計画しております。お客様のご要望にお応えできるよう、体制を強化してまいります。</p>`,
            content_en: `<p>To expand production capacity, we added NC automatic lathes in February 2024. With state-of-the-art equipment, we can now perform more precise and efficient machining.</p>
<h2>Installed Equipment</h2>
<ul>
<li>Star Micronics SR-20</li>
<li>Citizen Machinery L12</li>
<li>Processing diameter: φ3 to φ20</li>
</ul>
<p>We plan to continue capital investment in 2024. We will strengthen our capabilities to meet customer requirements.</p>`,
            content_vi: `<p>Để mở rộng năng lực sản xuất, chúng tôi đã bổ sung máy tiện tự động NC vào tháng 2/2024. Với thiết bị hiện đại, chúng tôi có thể thực hiện gia công chính xác và hiệu quả hơn.</p>
<h2>Thiết bị đã lắp đặt</h2>
<ul>
<li>Star Micronics SR-20</li>
<li>Citizen Machinery L12</li>
<li>Đường kính gia công: φ3 đến φ20</li>
</ul>
<p>Chúng tôi dự định tiếp tục đầu tư vào năm 2024. Chúng tôi sẽ tăng cường năng lực để đáp ứng yêu cầu của khách hàng.</p>`,
            image: "./assets/images/equipment/lathe.png",
            published_at: "2024-02-09"
        },
        {
            title_ja: "新型3D画像測定機を導入しました",
            title_en: "Introduced New 3D Image Measuring Machine",
            title_vi: "Đã đưa vào sử dụng máy đo hình ảnh 3D mới",
            date_ja: "2023年06月08日（木）",
            date_en: "June 8, 2023 (Thu)",
            date_vi: "08/06/2023 (Thứ 5)",
            excerpt_ja: "キーエンス製の3D画像測定機「LM-X」を導入いたしました。",
            excerpt_en: "We have introduced Keyence's 3D image measuring machine \"LM-X\".",
            excerpt_vi: "Chúng tôi đã đưa vào sử dụng máy đo hình ảnh 3D \"LM-X\" của Keyence.",
            content_ja: `<p>キーエンス製の3D画像測定機「LM-X」を導入いたしました。従来の測定機と比較して、測定時間を大幅に短縮し、より高精度な品質管理が可能となりました。</p>
<h2>導入機器の特長</h2>
<ul>
<li>高速・高精度測定</li>
<li>複雑形状の3D測定対応</li>
<li>自動レポート生成機能</li>
</ul>
<p>これにより、お客様への品質保証をより一層強化してまいります。</p>`,
            content_en: `<p>We have introduced Keyence's 3D image measuring machine "LM-X". Compared to conventional measuring machines, measurement time has been significantly reduced, enabling more precise quality control.</p>
<h2>Features of Introduced Equipment</h2>
<ul>
<li>High-speed, high-precision measurement</li>
<li>3D measurement of complex shapes</li>
<li>Automatic report generation</li>
</ul>
<p>This will further strengthen our quality assurance for customers.</p>`,
            content_vi: `<p>Chúng tôi đã đưa vào sử dụng máy đo hình ảnh 3D "LM-X" của Keyence. So với máy đo thông thường, thời gian đo đã được giảm đáng kể, cho phép kiểm soát chất lượng chính xác hơn.</p>
<h2>Tính năng của thiết bị</h2>
<ul>
<li>Đo tốc độ cao, độ chính xác cao</li>
<li>Đo 3D các hình dạng phức tạp</li>
<li>Tự động tạo báo cáo</li>
</ul>
<p>Điều này sẽ tăng cường hơn nữa đảm bảo chất lượng cho khách hàng.</p>`,
            image: "./assets/images/equipment/inspection.png",
            published_at: "2023-06-08"
        }
    ];

    const insertNews = db.prepare(`
        INSERT INTO news (
            title_ja, title_en, title_vi,
            date_ja, date_en, date_vi,
            excerpt_ja, excerpt_en, excerpt_vi,
            content_ja, content_en, content_vi,
            image, published_at, category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    news.forEach(n => {
        insertNews.run(
            n.title_ja, n.title_en, n.title_vi,
            n.date_ja, n.date_en, n.date_vi,
            n.excerpt_ja, n.excerpt_en, n.excerpt_vi,
            n.content_ja, n.content_en, n.content_vi,
            n.image, n.published_at, 'info'
        );
    });
    insertNews.finalize();
    console.log(`✅ Đã thêm ${news.length} tin tức`);
});

db.close(() => {
    console.log('');
    console.log('==========================================');
    console.log('✅ Database khởi tạo thành công!');
    console.log(`📁 File: ${DB_PATH}`);
    console.log('==========================================');
    console.log('');
    console.log('📊 Tổng kết:');
    console.log('   - 16 sản phẩm (6 featured)');
    console.log('   - 3 tin tức');
    console.log('   - Hỗ trợ 3 ngôn ngữ: JP, EN, VI');
    console.log('');
});
