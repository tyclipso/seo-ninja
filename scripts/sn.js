/**
 * @tableofcontents
 *
 * 1. seo ninja setup and calculations
 *    1.1 calculate elements amount
 *    1.2 calculate file responses (sitemap, robots)
 *    1.3 calculate heading structure
 *    1.4 calculate meta- and x-robots
 * 2. seo ninja panel initialisation
 *    1.1 destroy panel
 *    1.2 create panel
 *    1.3 create items
 *    1.4 handle score
 *    1.5 init
 */

(function (doc, win, $)
{
	'use strict';

	/* @section 1. seo ninja setup and calculations */

	$(function ()
	{
		win.sn = win.sn || {};

		/* misc */

		sn.version = '1.3.4';
		sn.hostname = win.location.hostname;
		sn.protocol = win.location.protocol;
		sn.timing = win.performance.timing;
		sn.scrollDuration = 1000;

		/* wording */

		sn.wording =
		{
			title: 'SEO Ninja',
			close: 'Close',
			types:
			{
				min: 'min.',
				general: 'General',
				ninja: 'Ninja',
				trainee: 'Trainee',
				novice: 'Novice'
			},
			messages:
			{
				ninja: 'Ninja, you make me proud',
				trainee: 'Trainee, room for improvement',
				novice: 'Novice, you are doing it wrong',
				console: 'Check the Javascript console for debug information'
			},
			point: '.',
			colon: ':',
			divider: '/'
		};

		/* counters */

		sn.score = 0;
		sn.total = 0;

		/* cache */

		sn.html = $('html');
		sn.body = sn.html.find('body');
		sn.head = sn.html.find('head');
		sn.code = sn.html.html();

		/* elements */

		sn.elements =
		{
			panel: sn.body.find('div.js_sn_panel'),
			css: sn.head.find('#sn_style'),
			js: sn.body.find('#sn_script, #sn_jquery'),
			jquery: sn.body.find('#sn_jquery')
		};

		/* setup */

		sn.setup =
		{
			titleTag:
			{
				elements: sn.head.find('title'),
				description: 'Title tag',
				amountGeneral: 1
			},
			metaXRobots:
			{
				elements: [],
				description: 'Meta-Robots and X-Robots-Tag index',
				amountGeneral: 1
			},
			metaDescription:
			{
				elements: sn.head.find('meta[name="description"]'),
				description: 'Meta Description tag',
				amountGeneral: 1
			},
			metaOgTitle:
			{
				elements: sn.head.find('meta[property="og:title"]'),
				description: 'Meta og:title property',
				amountGeneral: 1
			},
			metaOgDescription:
			{
				elements: sn.head.find('meta[property="og:description"]'),
				description: 'Meta og:description property',
				amountGeneral: 1
			},
			metaOgImage:
			{
				elements: sn.head.find('meta[property="og:image"]'),
				description: 'Meta og:image property',
				amountGeneral: 1
			},
			metaOgURL:
			{
				elements: sn.head.find('meta[property="og:url"]'),
				description: 'Meta og:url property',
				amountGeneral: 1
			},
			metaTwitterCard:
			{
				elements: sn.head.find('meta[name="twitter:card"]'),
				description: 'Meta twitter:card tag',
				amountGeneral: 1
			},
			canonicalURL:
			{
				elements: sn.head.find('link[rel="canonical"]'),
				description: 'Canonical URL',
				amountGeneral: 1
			},
			favIcon:
			{
				elements: sn.head.find('link').filter('[rel="icon"], [rel="shortcut icon"]'),
				description: 'Favicon',
				amountGeneral: 1
			},
			h1:
			{
				elements: sn.html.find('h1').not('article h1'),
				description: 'H1',
				amountGeneral: 1
			},
			h2:
			{
				elements: sn.html.find('h2').not('article h2'),
				description: 'H2',
				amountMin: 1,
				amountNinja: 2,
				amountTrainee: 5,
				amountNovice: 10
			},
			h3:
			{
				elements: sn.html.find('h3').not('article h3'),
				description: 'H3',
				amountMin: 1,
				amountNinja: 10,
				amountTrainee: 50,
				amountNovice: 100
			},
			wrongHeadingStructure:
			{
				elements: [],
				description: 'Wrong Heading Structure',
				amountNinja: 0,
				amountTrainee: 5,
				amountNovice: 10
			},
			emptyImgAltAttributes:
			{
				elements: sn.body.find('img:not([alt]),img[alt=""]'),
				description: 'Empty image alt attributes',
				amountNinja: 0,
				amountTrainee: 10,
				amountNovice: 20
			},
			emptyLinkTitleAttributes:
			{
				elements: sn.body.find('a:not([title]),a[title=""]'),
				description: 'Empty link title attributes',
				amountNinja: 0,
				amountTrainee: 10,
				amountNovice: 20
			},
			sitemapXML:
			{
				elements: [],
				description: 'sitemap.xml',
				amountGeneral: 1
			},
			robotsTXT:
			{
				elements: [],
				description: 'robots.txt',
				amountGeneral: 1
			},
			styleTagsInline:
			{
				elements: sn.html.find('style'),
				description: 'Inline style tags',
				amountNinja: 5,
				amountTrainee: 10,
				amountNovice: 20
			},
			styleExternals:
			{
				elements: sn.html.find('link[rel="stylesheet"]').not(sn.elements.css),
				description: 'External style files',
				amountNinja: 5,
				amountTrainee: 10,
				amountNovice: 20
			},
			styleThirdParty:
			{
				elements: sn.html.find('link[rel="stylesheet"][href^="http"],link[rel="stylesheet"][href^="//"]').not('link[rel="stylesheet"][href*="' + sn.hostname + '"]').not(sn.elements.css),
				description: 'Third Party styles',
				amountNinja: 5,
				amountTrainee: 10,
				amountNovice: 20
			},
			scriptTagsInline:
			{
				elements: sn.html.find('script').not('[src]'),
				description: 'Inline script tags',
				amountNinja: 5,
				amountTrainee: 10,
				amountNovice: 20
			},
			scriptExternals:
			{
				elements: sn.html.find('script[src]').not(sn.elements.js),
				description: 'External script files',
				amountNinja: 5,
				amountTrainee: 10,
				amountNovice: 20
			},
			scriptThirdParty:
			{
				elements: sn.html.find('script[src^="http"],script[src^="//"]').not('script[src*="' + sn.hostname + '"]').not(sn.elements.js),
				description: 'Third Party scripts',
				amountNinja: 5,
				amountTrainee: 10,
				amountNovice: 20
			},
		};

		/* @section 1.1 calculate elements amount */

		sn.calcElementsAmount = function ()
		{
			for (var i in sn.setup)
			{
				if (sn.setup.hasOwnProperty(i))
				{
					sn.total++;
					if (sn.setup[i].elements)
					{
						sn.setup[i].amount = sn.setup[i].elements.length;
					}
					else if (!sn.setup[i].amount)
					{
						sn.setup[i].amount = 0;
					}
				}
			}
		};

		/* @section 1.2 calculate file responses (sitemap, robots) */

		sn.calcFiles = function ()
		{
			var files = {
					sitemap: {
						filename: 'sitemap.xml',
						setupVar: 'sitemapXML'
					},
					robots: {
						filename: 'robots.txt',
						setupVar: 'robotsTXT'
					},
					favicon: {
						filename: 'favicon.ico',
						setupVar: 'favIcon'
					}
				},
				status = '',
				contentLength = '';			

			$.each(files, function(index, file) {
				// Only request favicon if not already found in header
				if ($.inArray(index, ['sitemap', 'robots']) != -1 || (index == 'favicon' && sn.setup.favIcon.amount == 0)) {
					/* request website */
					$.ajax({
						type: 'GET',
						url: sn.protocol + '//' + sn.hostname + '/' + file.filename,
						complete: function (xhr)
						{
							status = xhr.status;
							contentLength = xhr.getResponseHeader('Content-Length');
							if (status === 200 && (contentLength > 0 || contentLength === null)) {
								sn.setup[file.setupVar].amount = 1;
								
								// special case: no sitemap.xml, check for sitemap.xml in robots.txt
								if (sn.setup.robotsTXT.amount == 1 && sn.setup.sitemapXML.amount == 0) {
									var robotsSitemap = xhr.responseText.match(/Sitemap: ([^\s]+)/);
									if (robotsSitemap != null) {
										$.ajax({
											type: 'GET',
											url: robotsSitemap[1],
											complete: function (xhr)
											{
												status = xhr.status;
												contentLength = xhr.getResponseHeader('Content-Length');
												if (status === 200 && (contentLength > 0 || contentLength === null)) {
													sn.setup.sitemapXML.amount = 1;
												}
												
												/* refresh items and score */
	
												sn.panel.list.empty();
												sn.createItems();
												sn.handleScore();
											}
										});
									}
								}
							}
							
							/* refresh items and score */
	
							sn.panel.list.empty();
							sn.createItems();
							sn.handleScore();
						}
					});
				}
			});
		};

		/* @section 1.3 calculate heading structure */

		sn.calcHeadingStructure = function ()
		{
			var oldTagNumber = 0,
			    wrongHeadingCounter = 0;
			
			$('h1,h2,h3,h4,h5,h6').each(function(index, element) {
				var newTagNumber = parseInt(element.tagName.slice(1));
				if (Math.abs(oldTagNumber - newTagNumber) > 1) {
				    sn.setup.wrongHeadingStructure.elements.push(element);
				    sn.setup.wrongHeadingStructure.amount++;
				}
			    oldTagNumber = newTagNumber;
			});
		}
		
		/* @section 1.4 calculate robots (meta-robots and x-robots */
		
		sn.calcRobots = function ()
		{
			var xRobots = '',
				metaRobots = '';
			/* request website */

			$.ajax(
			{
				type: 'GET',
				url: window.location.href,
				complete: function (xhr)
				{
					xRobots = xhr.getResponseHeader('X-Robots-Tag');
					metaRobots = sn.head.find('meta[name="robots"]');
					// check for correct meta- and x-robots
					if ((xRobots === null || (xRobots != null && xRobots.indexOf('noindex')) === -1)
						&& (metaRobots.length === 0 || (metaRobots.length && metaRobots.attr('content').indexOf('noindex') === -1))
					) {
						sn.setup.metaXRobots.amount = 1;
					}

					/* refresh items and score */

					sn.panel.list.empty();
					sn.createItems();
					sn.handleScore();
				}
			});
		};
		
		/* @section 2. seo ninja panel initialisation */
		
		/* @section 2.1 destroy panel */

		sn.destroy = function ()
		{
			sn.body.find('div.js_sn_panel').add(sn.elements.css).add(sn.elements.js).remove();
			delete win.sn;
		};

		/* @section 2.2 create panel */

		sn.createPanel = function ()
		{
			sn.panel = sn.panel || {};
			if (sn.body.find('div.js_sn_panel').length === 0) {	
				/* append panel */
	
				sn.panel.body = $('<div class="js_sn_panel sn_panel"></div>').prependTo(sn.body);
				sn.panel.title = $('<h1 class="js_sn_title_panel sn_title_panel" title="' + sn.version + '">' + sn.wording.title + '</h1>').appendTo(sn.panel.body);
				sn.panel.list = $('<ul class="js_sn_list_panel sn_list_panel"></ul>').appendTo(sn.panel.body);

			}
			
			/* scroll top */

			sn.html.add(sn.body).animate(
			{
				scrollTop: 0
			}, sn.scrollDuration);

			/* panel title click */

			sn.panel.title.click(function ()
			{
				sn.destroy();
			});

			/* panel title hover */

			sn.panel.title.hover(function ()
			{
				sn.panel.title.text(sn.wording.close);
			}, function ()
			{
				sn.panel.title.text(sn.wording.title);
			});
		};

		/* @section 2.3 create items */

		sn.createItems = function ()
		{
			var output = '';

			/* reset score */

			sn.score = 0;

			/* collect output */

			for (var i in sn.setup)
			{
				if (sn.setup.hasOwnProperty(i))
				{
					output += '<li class="sn_item_panel sn_amount_';

					/* ninja */

					if ((sn.setup[i].amount <= sn.setup[i].amountNinja 
						&& sn.setup[i].amount >= (sn.setup[i].amountMin || 0)) 
						|| sn.setup[i].amount === sn.setup[i].amountGeneral)
					{
						sn.score++;
						output += 'ninja';
					}

					/* else trainee and novice */

					else
					{
						if (sn.setup[i].amount <= sn.setup[i].amountTrainee && sn.setup[i].amount >= (sn.setup[i].amountMin || 0))
						{
							output += 'trainee';
						}
						else
						{
							output += 'novice';
						}

						/* console output */

						if (typeof win.console === 'object' && sn.setup[i].elements && !sn.setup[i].console)
						{
							win.console.warn(sn.setup[i].description);
							if (sn.setup[i].elements.length)
							{
								win.console.log(sn.setup[i].elements);
							}
							sn.setup[i].console = true;
						}
					}

					/* collect title */

					output += '" title="';
					if (sn.setup[i].amountGeneral > -1)
					{
						output += sn.wording.types.general + sn.wording.colon + ' ' + sn.setup[i].amountGeneral;
					}
					else
					{
						if (sn.setup[i].amountMin > 0)
						{
							output += sn.wording.types.min + sn.wording.colon + ' ' + sn.setup[i].amountMin + ' '
						}
						output += sn.wording.types.ninja + sn.wording.colon + ' ' + sn.setup[i].amountNinja + ' ';
						output += sn.wording.types.trainee + sn.wording.colon + ' ' + sn.setup[i].amountTrainee + ' ';
						output += sn.wording.types.novice + sn.wording.colon + ' ' + sn.setup[i].amountNovice;
					}
					output += '">' + sn.setup[i].description + sn.wording.colon + ' ' + sn.setup[i].amount + '</li>';
				}
			}

			/* append output to panel list */

			sn.panel.list.html(output);
		};

		/* @section 2.4 handle score */

		sn.handleScore = function ()
		{
			var output = '';

			/* force limitation */

			if (sn.score < 0)
			{
				sn.score = 0;
			}
			else if (sn.score > sn.total)
			{
				sn.score = sn.total;
			}

			/* handle score */

			if (sn.score >= (sn.total * 0.8))
			{
				sn.type = 'ninja';
			}
			else if (sn.score >= (sn.total * 0.6))
			{
				sn.type = 'trainee';
			}
			else
			{
				sn.type = 'novice';
			}

			/* collect output */

			output = '<li class="sn_item_message sn_amount_' + sn.type + '" title="' + sn.wording.messages.console + sn.wording.point + '">';
			output += '<span id="sn_score" class="sn_score">' + sn.score + sn.wording.divider + sn.total + '</span><span class="sn_message">' + sn.wording.messages[sn.type] + sn.wording.point + '</span></li>';

			/* modify panel */

			sn.panel.list.append(output);
			sn.panel.body.addClass('sn_score_' + sn.type);
		};

		/* @section 2.5 init */

		sn.init = function ()
		{
			sn.calcElementsAmount();
			sn.calcHeadingStructure();
			sn.calcFiles();
			sn.calcRobots();
			sn.createPanel();
			sn.createItems();
			sn.handleScore();
		};

		/* init */

		sn.init();
	});
})(document, window, window.jQuery);
