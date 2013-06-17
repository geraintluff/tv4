module.exports = function (grunt) {
	'use strict';

	var path = require('path');
	var util = require('util');

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			tests: ['tmp', 'test/all_concat.js']
		},
		jshint: {
			//lint for mistakes
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['test/tests/**/*.js','test/all_*.js']
		},
		concat: {
			options: {
				separator: '\n\n',
				banner: grunt.file.read('test/header.js')
			},
			all_concat: {
				//bundle all-in-one
				src: ['test/tests/**/*.js'], dest: 'test/all_concat.js'
			}
		},
		mochaTest: {
			//node-side
			any: {
				src: ['test/all_concat.js'],
				options: {
					reporter: 'Spec'
				}
			}
		},
		mocha: {
			//browser-side
			any: {
				src: ['test/*.html'],
				options: {
					reporter: 'Spec',
					log: true,
					run: true
				}
			}
		}
	});

	// main cli commands
	grunt.registerTask('default', ['test']);
	grunt.registerTask('build', ['clean', 'concat', 'jshint']);
	grunt.registerTask('test', ['build', 'mocha', 'mochaTest']);
};