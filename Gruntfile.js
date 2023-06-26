module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		BASE_FOLDER: "assets",
		DIST_ENVIRONMENT: "build",

		BANNER_TEXT: 'Project: <%= pkg.name %>. Created by: <%= pkg.author %>. Version: <%= pkg.version %>.\n' + 
            'This project is valid for the duration: <%= pkg.projectDetails.startDate %> - <%= pkg.projectDetails.endDate %>.',

		clean: {
			dev: ["<%= BASE_FOLDER%>/js/*.js"],
			dist: ["<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>"]
		},

		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= BANNER_TEXT %> */\n',
				// sourceMap: true,
				separator: ";"
			},
            /*
                CDN Path:
                1. code.jquery.com/jquery-1.11.3.min.js
                2. maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js
                3. cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.carousel.min.js
            */
            devVendors: {
                src: ["<%= BASE_FOLDER %>/js/lib/jquery/*.js",
                "<%= BASE_FOLDER %>/js/lib/bootstrap/*.js",
                "<%= BASE_FOLDER %>/js/lib/owl-carousel/*.js"],
                dest: "<%= BASE_FOLDER %>/js/vendor.js"
            },
			devModules: {
				src: ["<%= BASE_FOLDER %>/js/modules/*"],
				dest: "<%= BASE_FOLDER %>/js/main.js"
			}
		},

		compass: {
            dev: {
                options: {
                    sassDir: '<%= BASE_FOLDER %>/sass',
                    cssDir: '<%= BASE_FOLDER %>/css',
                    outputStyle: 'expanded',
                    noLineComments: true
                }
            },
            dist: {
                options: {
                    sassDir: '<%= BASE_FOLDER %>/sass',
                    cssDir: '<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/css',
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            }
        },

        htmlmin: {
        	dist: {
        		options: {
        			removeComments: true,
        			collapseWhitespace: true
        		},
        		files: {
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/index.html" : "<%= BASE_FOLDER%>/index.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/home-content.html" : "<%= BASE_FOLDER%>/templates/home-content.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/aboutus-content.html" : "<%= BASE_FOLDER%>/templates/aboutus-content.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/enquiry-content.html" : "<%= BASE_FOLDER%>/templates/enquiry-content.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/info-center-content.html" : "<%= BASE_FOLDER%>/templates/info-center-content.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/send_mail.php" : "<%= BASE_FOLDER%>/templates/send_mail.php",

                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/projects/gold-crest-content.html" : "<%= BASE_FOLDER%>/templates/projects/gold-crest-content.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/projects/blue-crest-content.html" : "<%= BASE_FOLDER%>/templates/projects/blue-crest-content.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/projects/blue-crest-floor-plan.html" : "<%= BASE_FOLDER%>/templates/projects/blue-crest-floor-plan.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/projects/springdale-content.html" : "<%= BASE_FOLDER%>/templates/projects/springdale-content.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/projects/springfields-content.html" : "<%= BASE_FOLDER%>/templates/projects/springfields-content.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/projects/luxus-tower-content.html" : "<%= BASE_FOLDER%>/templates/projects/luxus-tower-content.html",
                    "<%= BASE_FOLDER%>/<%= DIST_ENVIRONMENT%>/templates/projects/silver-crest-content.html" : "<%= BASE_FOLDER%>/templates/projects/silver-crest-content.html"
        		}
        	}
        },

        uglify: {
        	options:{
        		banner: "/*! <%= BANNER_TEXT %> */",
        		compress: {
                    drop_console: true
                },
        		sourceMap: true,
                preserveComments: false
        	},
        	dist: {
        		files: {
        			"<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/js/main.js" : [
        				"<%= BASE_FOLDER %>/js/main.js"
        			],
        			"<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/js/vendor.js" : [
        				"<%= BASE_FOLDER %>/js/vendor.js"
        			]
        		}
        	}
        },

        copy: {
            imagesNFonts: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= BASE_FOLDER %>/",
                        filter: "isFile",
                        src: "img/**",
                        dest: "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/"
                    },
                    {
                        expand: true,
                        cwd: "<%= BASE_FOLDER %>/",
                        filter: "isFile",
                        src: "fonts/**",
                        dest: "<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT %>/"
                    }
                ]
            }
        },
        
        watch: {
	        	options: {
                    debounceDelay: 500,
	        		livereload: true
	        	},
	        	html: {
	        		files: ['<%= BASE_FOLDER %>/**/*.html'],
                    tasks: ["htmlmin:dist"]
	        	},
	        	css: {
	        		files: ['<%= BASE_FOLDER %>/sass/**'],
	        		tasks: ["compass:dev"]
	        	},
                js: {
                    files: ['<%= BASE_FOLDER %>/js/**/*.js'],
                    tasks: ["concat:devVendors", "concat:devModules"]
                }
        },
        connect: {
        	dev: {
        		options: {
        			hostname: "localhost",
        			port: 1985,
        			base: "<%= BASE_FOLDER %>",
        			middleware: function(connect,options){
        				// console.log(options);
        				return [
        					require('connect-livereload')(),
        					connect.static(options.base[0], options),
        					connect.directory(options.base[0])
        				];
        			}
        		}
        	},
        	dist: {
        		options: {
        			hostname: "localhost",
        			port: 1986,
        			base: ["<%= BASE_FOLDER %>/<%= DIST_ENVIRONMENT%>", "<%= BASE_FOLDER %>/build/css", "<%= BASE_FOLDER %>/build/js"],
        			// directory: "<%= BASE_FOLDER %>/build",
        			middleware: function(connect,options){
        				// console.log(options);
        				return [
        					require('connect-livereload')(),
        					connect.static(options.base[0]),
        					connect.directory(options.base[0])
        				];
        			}
        		}
        	}
        },
        open: {
        	dev: { path: "http://localhost:1985/" },
        	dist: { path: "http://localhost:1986/" }
        }

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');

	// Generate DEVELOPMENT CONTENT
	grunt.registerTask("dev", "Run Build Process Tasks", function(){
		var tasks = [
			"clean:dev",
            "compass:dev",
            "concat",
			"open:dev", "connect:dev",
			"watch"
		];

		// always use force when watching
        // grunt.option('force', true);
        grunt.task.run(tasks);
	});

	// Generate PRODUCTION CONTENT
	grunt.registerTask("build", "Run Build Process Tasks", function(){
		var tasks = [
			"clean:dist",
            "htmlmin:dist",
            "compass:dist",
            "uglify:dist",
            "copy:imagesNFonts",
            "open:dist", "connect:dist",
			"watch"
		];

		// always use force when watching
        // grunt.option('force', true);
        grunt.task.run(tasks);
	});
};

// TODO:
// 1] Install grunt-contrib-jshint