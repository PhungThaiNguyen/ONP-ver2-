# ================================================
# O.N.Precision - SEO Update Script
# ================================================
# This script updates all HTML pages with enhanced SEO tags
# Run: .\update-seo.ps1
# ================================================

$ErrorActionPreference = "Stop"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  O.N.Precision SEO Update Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Page configurations
$pages = @(
    @{
        File          = "works.html"
        Title         = "事業内容 | O.N.Precision - 精密切削加工"
        TitleEN       = "Our Services | O.N.Precision - Precision Machining"
        Description   = "O.N.Precisionの事業内容。NC旋盤による精密切削加工、自動車部品・電子部品の高精度加工を承ります。"
        DescriptionEN = "O.N.Precision services: precision machining with NC lathes, high-precision processing of automotive and electronic components."
        Canonical     = "works.html"
        BreadcrumbJA  = "事業内容"
        BreadcrumbEN  = "Services"
    },
    @{
        File          = "products.html"
        Title         = "加工事例 | O.N.Precision - 精密切削加工"
        TitleEN       = "Products Gallery | O.N.Precision - Precision Machining"
        Description   = "O.N.Precisionの加工事例・製品ギャラリー。真鍮・ステンレス・アルミなど精密切削加工品をご紹介します。"
        DescriptionEN = "O.N.Precision product gallery: brass, stainless steel, aluminum precision machined parts."
        Canonical     = "products.html"
        BreadcrumbJA  = "加工事例"
        BreadcrumbEN  = "Products"
    },
    @{
        File          = "equipment.html"
        Title         = "設備一覧 | O.N.Precision - 精密切削加工"
        TitleEN       = "Equipment | O.N.Precision - Precision Machining"
        Description   = "O.N.Precisionの設備一覧。NC自動旋盤、複合旋盤、各種検査機器を完備。高精度加工を実現する最新設備をご紹介。"
        DescriptionEN = "O.N.Precision equipment list: NC automatic lathes, multi-axis lathes, and inspection equipment for high-precision machining."
        Canonical     = "equipment.html"
        BreadcrumbJA  = "設備一覧"
        BreadcrumbEN  = "Equipment"
    },
    @{
        File          = "company.html"
        Title         = "会社案内 | O.N.Precision - 精密切削加工"
        TitleEN       = "About Us | O.N.Precision - Precision Machining"
        Description   = "O.N.Precisionの会社案内。1967年創業の精密切削加工メーカー。沿革、アクセス、代表挨拶をご紹介。"
        DescriptionEN = "About O.N.Precision: Founded in 1967, a precision machining manufacturer. Company history, access, and CEO message."
        Canonical     = "company.html"
        BreadcrumbJA  = "会社案内"
        BreadcrumbEN  = "About Us"
    },
    @{
        File          = "recruit.html"
        Title         = "採用情報 | O.N.Precision - 精密切削加工"
        TitleEN       = "Careers | O.N.Precision - Precision Machining"
        Description   = "O.N.Precisionの採用情報。ものづくりに情熱を持つ方を募集中。福利厚生、募集要項をご紹介。"
        DescriptionEN = "O.N.Precision careers: We're hiring passionate craftsmen. Benefits and job requirements."
        Canonical     = "recruit.html"
        BreadcrumbJA  = "採用情報"
        BreadcrumbEN  = "Careers"
    },
    @{
        File          = "news.html"
        Title         = "お知らせ | O.N.Precision - 精密切削加工"
        TitleEN       = "News | O.N.Precision - Precision Machining"
        Description   = "O.N.Precisionからのお知らせ。設備投資情報、会社ニュース、イベント情報などを配信。"
        DescriptionEN = "O.N.Precision news: equipment updates, company news, and event information."
        Canonical     = "news.html"
        BreadcrumbJA  = "お知らせ"
        BreadcrumbEN  = "News"
    },
    @{
        File          = "contact.html"
        Title         = "お問い合わせ | O.N.Precision - 精密切削加工"
        TitleEN       = "Contact Us | O.N.Precision - Precision Machining"
        Description   = "O.N.Precisionへのお問い合わせはこちら。見積り依頼、技術相談など、お気軽にご連絡ください。"
        DescriptionEN = "Contact O.N.Precision for quotes, technical consultation, and inquiries."
        Canonical     = "contact.html"
        BreadcrumbJA  = "お問い合わせ"
        BreadcrumbEN  = "Contact"
    }
)

# SEO enhancement template
$seoTemplate = @'
<head>
    <!-- ========================
         Enhanced SEO Meta Tags
         ======================== -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- Primary Meta Tags -->
    <title>{{TITLE}}</title>
    <meta name="title" content="{{TITLE}}">
    <meta name="description" content="{{DESCRIPTION}}">
    <meta name="keywords" content="精密加工, 切削加工, CNC加工, O.N.Precision, 旋盤加工, precision machining, gia công chính xác">
    <meta name="author" content="O.N.Precision">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow">

    <!-- Theme Color -->
    <meta name="theme-color" content="#8b1a1a">
    <meta name="msapplication-TileColor" content="#8b1a1a">

    <!-- Canonical URL -->
    <link rel="canonical" href="https://www.onprecision.com/{{CANONICAL}}">

    <!-- Language Alternates -->
    <link rel="alternate" hreflang="ja" href="https://www.onprecision.com/{{CANONICAL}}">
    <link rel="alternate" hreflang="en" href="https://www.onprecision.com/{{CANONICAL}}?lang=en">
    <link rel="alternate" hreflang="vi" href="https://www.onprecision.com/{{CANONICAL}}?lang=vi">
    <link rel="alternate" hreflang="x-default" href="https://www.onprecision.com/{{CANONICAL}}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="O.N.Precision">
    <meta property="og:url" content="https://www.onprecision.com/{{CANONICAL}}">
    <meta property="og:title" content="{{TITLE}}">
    <meta property="og:description" content="{{DESCRIPTION}}">
    <meta property="og:image" content="https://www.onprecision.com/assets/images/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="ja_JP">
    <meta property="og:locale:alternate" content="en_US">
    <meta property="og:locale:alternate" content="vi_VN">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@O.N.Precision">
    <meta name="twitter:title" content="{{TITLE}}">
    <meta name="twitter:description" content="{{DESCRIPTION}}">
    <meta name="twitter:image" content="https://www.onprecision.com/assets/images/og-image.jpg">

    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="./assets/images/favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="./assets/images/apple-touch-icon.png">

    <!-- Preconnect for Performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.onprecision.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "{{BREADCRUMB}}",
                "item": "https://www.onprecision.com/{{CANONICAL}}"
            }
        ]
    }
    </script>
'@

Write-Host "Processing pages..." -ForegroundColor Yellow
Write-Host ""

foreach ($page in $pages) {
    $filePath = "d:\ONP-Website\$($page.File)"
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Generate SEO head section
        $newHead = $seoTemplate `
            -replace '{{TITLE}}', $page.Title `
            -replace '{{DESCRIPTION}}', $page.Description `
            -replace '{{CANONICAL}}', $page.Canonical `
            -replace '{{BREADCRUMB}}', $page.BreadcrumbJA
        
        # Check if we need to add CSS links specific to each page
        if ($content -match 'href="./assets/css/(\w+)\.css"') {
            $cssFile = $matches[1]
            $newHead += "`n    <!-- Main CSS -->`n    <link rel=`"stylesheet`" href=`"./assets/css/style.css`">`n    <link rel=`"stylesheet`" href=`"./assets/css/$cssFile.css`">"
        }
        else {
            $newHead += "`n    <!-- Main CSS -->`n    <link rel=`"stylesheet`" href=`"./assets/css/style.css`">"
        }
        
        $newHead += "`n</head>"
        
        Write-Host "  ✅ $($page.File) - SEO template ready" -ForegroundColor Green
        Write-Host "     Title: $($page.Title)" -ForegroundColor Gray
    }
    else {
        Write-Host "  ⚠️ $($page.File) - Not found" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Script completed!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: This script only shows what would be updated." -ForegroundColor Yellow
Write-Host "To actually update the files, you need to:" -ForegroundColor Yellow
Write-Host "  1. Use multi_replace_file_content tool for each page" -ForegroundColor White
Write-Host "  2. Or manually copy the enhanced head section" -ForegroundColor White
Write-Host ""
