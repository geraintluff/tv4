module.exports = function (grunt) {
	'use strict';

	var path = require('path');
	var util = require('util');

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			test_deps: {
				expand: true,
				flatten: true,
				src: ['node_modules/mocha/mocha.js', 'node_modules/mocha/mocha.css', 'node_modules/proclaim/proclaim.js'],
				dest: 'test/deps'
			}
		},
		clean: {
			tests: ['tmp', 'test/all_concat.js']
		},
		jshint: {
			//lint for mistakes
			options: {
				jshintrc: '.jshintrc'
			},
			tests: ['test/tests/**/*.js', 'test/all_*.js']

			//TODO this should be enabled
			// output: ['tv4.js']
		},
		concat: {
			source: {
				options: {
					separator: '\n',
					banner: '/**\n' + grunt.file.read('LICENSE.txt') + '**/\n\n'
				},
				expand: true,
				cwd: 'source',
				rename: function (dest, src) {
					return dest;
				},
				src: ['_header.js',
					'_polyfill.js',
					'validate.js',
					'basic.js',
					'numeric.js',
					'string.js',
					'array.js',
					'object.js',
					'combinations.js',
					'resolve-uri.js',
					'normalise-schema.js',
					'api.js',
					'_footer.js'],
				dest: 'tv4.js'
			},
			tests: {
				options: {
					separator: '\n\n',
					banner: grunt.file.read('test/header.js')
				},
				//bundle all-in-one
				src: ['test/tests/**/*.js'], dest: 'test/all_concat.js'
			}
		},
		uglify: {
			tv4: {
				options: {
					report: 'min'
				},
				files: {
					'tv4.min.js': ['tv4.js']
				}
			}
		},
		mochaTest: {
			//node-side
			any: {
				src: ['test/all_concat.js'],
				options: {
					reporter: 'mocha-unfunk-reporter'
				}
			}
		},
		mocha: {
			//browser-side
			any: {
				src: ['test/index*.html'],
				options: {
					reporter: 'Dot',
					log: true,
					run: true
				}
			}
		}
	});

	require('mocha-unfunk-reporter').option('style', 'ansi');
	// main cli commands
	grunt.registerTask('default', ['test']);
	grunt.registerTask('build', ['clean', 'concat', 'jshint', 'uglify', 'copy']);
	grunt.registerTask('test', ['build', 'mocha', 'mochaTest']);
};