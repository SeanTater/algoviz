/**
 * SyntheticBenchmark gives calculated benchmark results for reference
 * The point is to give a line on the chart for comparison
 * 
 * interface Benchmark {
 *     Structure subject
 *     string subject_name
 * 
 *     float function(int count)
 * }
 */
function SyntheticBenchmark(equation) {
    this.subject = null;
    this.subject_name = equation.toString();
    this._equation = equation;
}

SyntheticBenchmark.prototype.run = function(count) {
    return this._equation(count);
}