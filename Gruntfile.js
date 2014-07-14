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
	grunt.loadNpmTasks('grunt-component');
	grunt.loadNpmTasks('grunt-push-release');
	grunt.loadNpmTasks('grunt-regex-replace');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		push: {
			options: {
				updateConfigs: ['pkg'],
				files: ['package.json', 'component.json', 'bower.json'],
				add: false,
				addFiles: [],
				commit: false,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['-a'],
				createTag: false,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				pushTo: 'origin',
				npm: false,
				npmTag: 'Release v%VERSION%',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		},
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
			maps: ['*.js.map'],
			build: ['tv4.js', 'tv4.min.js', '*.js.map', 'test/all_concat.js', 'test/all_concat.js.map']
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
		'regex-replace': {
			unmap: {
				src: ['tv4.js', 'tv4.min.js'],
				actions: [
					{
						name: 'map',
						search: '\r?\n?\\\/\\\/[@#] sourceMappingURL=.*',
						replace: '',
						flags: 'g'
					}
				]
			}
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
					'uri-template-fill.js',
					'validate.js',
					'basic.js',
					'numeric.js',
					'string.js',
					'array.js',
					'object.js',
					'combinations.js',
					'hypermedia.js',
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
		component: {
			build: {
				options: {
					action: 'build', // can be omitted (build = default)
					args: {
						//standalone: '$',
						dev: true
					}
				}
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
						gfm: true,
						highlight: false
					}
				},
				src: 'README.md',
				dest: 'index.html'
			}
		}
	});

	// main cli commands
	grunt.registerTask('default', ['test']);
	grunt.registerTask('prepublish', ['cleanup']);

	grunt.registerTask('products', ['uglify:tv4', 'component:build', 'markdown']);
	grunt.registerTask('core', ['clean', 'concat_sourcemap', 'jshint', 'products', 'copy:test_deps']);

	grunt.registerTask('build', ['core', 'cleanup']);
	grunt.registerTask('test', ['core', 'mochaTest', 'mocha', 'cleanup']);
	grunt.registerTask('cleanup', ['regex-replace:unmap', 'clean:maps']);

	grunt.registerTask('dev', ['clean', 'concat_sourcemap', 'jshint', 'mochaTest']);
};
