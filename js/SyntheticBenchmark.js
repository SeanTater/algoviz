/** SyntheticBenchmark gives a reference for complexity */
function SyntheticBenchmark(equation) {
    this.equation = equation;
}

SyntheticBenchmark.prototype.run = function(count) {
    return this.equation(count);
}