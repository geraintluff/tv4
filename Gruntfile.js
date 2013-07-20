module.exports = function (grunt) {
	'use strict';

	var path = require('path');
	var util = require('util');

	require('source-map-support').install();

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-concat-sourcemap');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-markdown');
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
			tests: ['tmp', 'test/all_concat.js'],
			build: ['tv4.js', 'tv4.min.js', '*js.map', 'test/all_concat.js', 'test/all_concat.js.map']
		},
		jshint: {
			//lint for mistakes
			options:{
				reporter: './node_modules/jshint-path-reporter',
				jshintrc: '.jshintrc'
			},
			tests: ['test/tests/**/*.js', 'test/all_*.js'],
			output: ['./tv4.js']
		},
		concat_sourcemap: {
			options: {
				separator: '\n'
			},
			source: {
				expand: true,
				cwd: 'source',
				rename: function (dest, src) {
					return dest;
				},
				src: [
					'../LICENSE.txt',
					'_header.js',
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
					'_footer.js'
				],
				dest: 'tv4.js'
			},
			tests: {
				src: ['test/_header.js', 'test/tests/**/*.js'],
				dest: 'test/all_concat.js'
			}
		},
		uglify: {
			tv4: {
				options: {
					report: 'min',
					sourceMapIn: 'tv4.js.map',
					sourceMap: 'tv4.min.js.map'
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
					reporter: 'mocha-unfunk-reporter',
					bail: false
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
		},
		markdown: {
			index: {
				options: {
					template: 'doc/_template.html',
					markdownOptions: {
						gfm: true
					}
				},
				src: 'README.md',
				dest: 'index.html'
			}
		}
	});

	// main cli commands
	grunt.registerTask('default', ['test']);
	grunt.registerTask('build', ['clean', 'concat_sourcemap', 'jshint', 'uglify:tv4', 'copy', 'markdown']);
	grunt.registerTask('test', ['build', 'mochaTest', 'mocha']);

	grunt.registerTask('dev', ['clean', 'concat_sourcemap', 'jshint', 'mochaTest']);
};
