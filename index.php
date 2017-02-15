<?php 
$url = '//' . "{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
?>
<!DOCTYPE html>
<html lang="en">

	<!-- head -->

	<head>
		<meta charset="utf-8" />
		<meta name="description" content="SEO audit bookmarklet" />
		<meta property="og:title" content="SEO Ninja - SEO audit bookmarklet" />
		<meta property="og:description" content="SEO audit bookmarklet" />
		<meta property="og:url" content="https:<?php echo $url; ?>" />
		<meta name="robots" content="all" />
		<meta name="viewport" content="width=device-width" />
		<title>SEO Ninja - SEO audit bookmarklet</title>
		<link type="text/css" href="styles/index_min.css" media="all" rel="stylesheet" />
		<link rel="canonical" href="https:<?php echo $url; ?>" />
	</head>

	<!-- body -->

	<body>

		<!-- content -->

		<div class="content wrapper">

			<h1 class="title_content">SEO Ninja</h1>
			<div class="box_content">
				SEO audit bookmarklet by Albrecht Mauersberger
			</div>

			<a class="link_drag" href=
				"javascript:(function (doc, win)
				{
					/* load jquery */

					if (typeof win.jQuery === 'undefined')
					{
						var loadSNJquery = doc.createElement('script');

						loadSNJquery.type = 'text/javascript';
						loadSNJquery.onload = loadSN;
						loadSNJquery.src = '//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js';
						loadSNJquery.id = 'sn_jquery';
						doc.body.appendChild(loadSNJquery);
					}
					else
					{
						loadSN();
					}

					/* load seo ninja */

					function loadSN()
					{
						/* load script */

						var loadSNScript = doc.createElement('script');

						loadSNScript.type = 'text/javascript';
						loadSNScript.src = '<?php echo $url?>scripts/sn.js';
						loadSNScript.id = 'sn_script';
						doc.body.appendChild(loadSNScript);

						/* load style */

						var loadSNStyle = doc.createElement('link');

						loadSNStyle.type = 'text/css';
						loadSNStyle.href = '<?php echo $url?>styles/sn_min.css';
						loadSNStyle.media = 'all';
						loadSNStyle.rel = 'stylesheet';
						loadSNStyle.id = 'sn_style';
						doc.getElementsByTagName('head')[0].appendChild(loadSNStyle);
					}
				}(document, window));"
				title="Frontend developer SEO bookmarklet">Drag SEO Ninja to your bookmarks bar
			</a>
		</div>

		<!-- footer -->

		<div class="footer wrapper">

			<h2 class="title_footer">Audit criteria</h2>
			<ol class="list_footer">
				<li>Title tag</li>
				<li>Meta-Robots and X-Robots-Tag index</li>
				<li>Meta Description tag</li>
				<li>Meta og:title property</li>
				<li>Meta og:description property</li>
				<li>Meta og:image property</li>
				<li>Meta og:url property</li>
				<li>Meta twitter:card tag</li>
				<li>Canonical URL</li>
				<li>Favicon</li>
				<li>H1</li>
				<li>H2</li>
				<li>H3</li>
				<li>Wrong Heading Structure</li>
				<li>Empty image alt attributes</li>
				<li>Empty link title attributes</li>
				<li>sitemap.xml</li>
				<li>robots.txt</li>
				<li>Inline style tags</li>
				<li>External style files</li>
				<li>Third Party styles</li>
				<li>Inline script tags</li>
				<li>External script files</li>
				<li>Third Party scripts</li>
			</ol>
			<div class="box_content">Inspired by <a href="http://domninja.com/" title="DOM Ninja">DOM Ninja</a>.</div>
		</div>
	</body>
</html>
