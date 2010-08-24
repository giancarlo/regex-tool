#
# Build JS Files
#
require 'rake/packagetask'

# We have to make sure src/core.js is included first.
SRC = 'regex.js'
MINOUTPUT = 'regex.min.js'
JAVA = 'java'
JS = 'js'

desc "Minify script"
task :minify do
	`#{JAVA} -jar tools/yuicompressor.jar -v #{SRC} -o #{MINOUTPUT}`	
	puts MINOUTPUT + ': ' + File.size(MINOUTPUT).to_s
	puts "html: " + File.size('index.html').to_s
	puts "total: " + (File.size(MINOUTPUT) + File.size('index.html')).to_s
	puts `cat #{MINOUTPUT}`
end

desc "Lint"
task :lint do
	puts `#{JS} tools/jslint.js #{SRC}`
end

desc "Syntax Check"
task :syntax do
	puts `#{JS} -f #{SRC}`
end

desc "Test"
task :test do
	puts `#{JS} test/*.js`
end

desc "Default Action"
task :default => [:minify]
