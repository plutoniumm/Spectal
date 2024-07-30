# replace urls in dist/index.html

file="dist/index.html"

# /assets -> ./assets
sed -i '' 's|"/|"./|g' $file
