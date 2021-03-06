// djuned
// H30/7/10

//https://github.com/qiao/PathFinding.js
//https://stackoverflow.com/questions/13725138/javascript-multi-dimensional-dynamic-array

// GLOBAL

var PF = require('pathfinding');


var fs = require('fs'),
    PNG = require('pngjs').PNG;

var start = []; // y,x
var dests = []; // array of dest
var it = 0;

var most = [];

main();
// example();

// functions

function main()
{
fs.createReadStream('map.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
        
        var grid = new PF.Grid(this.width, this.height); 
 
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;
 
                // // invert color
                // this.data[idx] = 255 - this.data[idx];
                // this.data[idx+1] = 255 - this.data[idx+1];
                // this.data[idx+2] = 255 - this.data[idx+2];
 
                // // and reduce opacity
                // this.data[idx+3] = this.data[idx+3] >> 1;
                
                // barrier
                if (this.data[idx] === 0 && this.data[idx+1] === 0 && this.data[idx+2] === 0)
                {
                    grid.setWalkableAt(x, y, false);
                }
                
                // walkable
                else
                {
                    grid.setWalkableAt(x, y, true);
                }
                    
                // red
                if (this.data[idx] === 255 && this.data[idx+1] === 0 && this.data[idx+2] === 0)
                {
                    dests[it] = [x, y];
                    it++;
                    
                    if (!most[0])
                        most[0] = [x, y];
                    
                    else
                        most[1] = [x, y];
                }
                
                // green
                else if (this.data[idx] === 0 && this.data[idx+1] === 255 && this.data[idx+2] === 0)
                    start = [x, y];
            }
        }
        
        var gridBackup = grid.clone();
        // 7 type --> 5
        for (var i=0; i<5; i++)
        {
            var finder = generateFinder(i);
            
            doFinding(grid, finder);
            
            grid = gridBackup.clone();
        }
        // this.pack().pipe(fs.createWriteStream('out.png'));
    });
}
    
function count(path)
{
    var length = 0;
    
    for (var i=1; i<path.length;i++)
    {
        length += Math.sqrt( (path[i][0] - path[i-1][0])*(path[i][0] - path[i-1][0]) + (path[i][1] - path[i-1][1])*(path[i][1] - path[i-1][1]) );
    }
    
    return length;
}

function doFinding(grid, finder)
{
    //var shortest_paths = [];
    var minimum_paths = 99999999;
    
    //console.log(start);
    
    //grid.setWalkableAt(start[0], start[1], true);
    
    var gridBackup = grid.clone();
    
    var it=0;
    for (var i=0; i<dests.length; i++)
    {
        if (!(dests[i][0] == most[0][0] || dests[i][0] == most[1][0] || dests[i][1] == most[0][1] || dests[i][1] == most[1][1]))
            continue;
        
        //console.log(dests[i]);
        
        //grid.setWalkableAt(dests[i][0], dests[i][1], true);
        
        var path = finder.findPath(start[0], start[1], dests[i][0], dests[i][1], grid);
        //console.log(path);
        //shortest_paths[it] = count(path);
        //it++;
        
        var c = count(path);
        minimum_paths = minimum_paths < c ? minimum_paths : c;
        
        grid = gridBackup.clone();
    }
    
    //console.log(shortest_paths);
    console.log("length: " + minimum_paths);
}

function generateFinder(idx)
{
    var finder;
    
    if (idx === 0)
    {
        finder = new PF.AStarFinder({
            allowDiagonal: true,
            dontCrossCorners: false
        });
        
        console.log("AStar");
    }
    else if (idx === 1)
    {
        finder = new PF.BestFirstFinder({
            allowDiagonal: true,
            dontCrossCorners: false
        });
        
        console.log("BestFirst");
    }
    else if (idx === 2)
    {
        finder = new PF.BreadthFirstFinder({
            allowDiagonal: true,
            dontCrossCorners: false
        });
        
        console.log("BreadthFirst");
    }
    else if (idx === 3)
    {
        finder = new PF.DijkstraFinder({
            allowDiagonal: true,
            dontCrossCorners: false
        });
        
        console.log("Dijkstra");
    }
    // else if (idx === 4)
    // {
    //     finder = new PF.IDAStarFinder({
    //         allowDiagonal: true,
    //         dontCrossCorners: false
    //     });
        
    //     console.log("IDAStar");
    // }
    else //if (idx === 5)
    {
        finder = new PF.JumpPointFinder({
            allowDiagonal: true,
            dontCrossCorners: false
        });
        
        console.log("JumpPoint");
    }
    // else
    // {
    //     finder = new PF.OrthogonalJumpPointFinder({
    //         allowDiagonal: true,
    //         dontCrossCorners: false
    //     });
        
    //     console.log("OrthogonalJumpPoint");
    // }
    
    return finder;
}

function example()
{
    var matrix = [
        [0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 1, 0, 0],
    ];
    var grid = new PF.Grid(matrix);
    var finder = new PF.AStarFinder();
    var path = finder.findPath(1, 2, 4, 2, grid);
    console.log(count(path));
}