import { connectDB } from './config/db.js';
import { AddStep, FetchDataPipeline } from "./models/data.flow.model.js";

connectDB();

// const pipeline_id=3
// const name='second_step'
// const config={'key':'value', 'key_2':'value_2'}
// await AddStep(pipeline_id, name, config);
// console.log('test succesful');

const pipeline_id=3
const data_pipeline = await FetchDataPipeline(pipeline_id);
console.log(data_pipeline)
// console.log('pipeline_name=', data_pipeline.pipeline_name, typeof(data_pipeline.pipeline_name))
// console.log('input_data=', data_pipeline.input_data, typeof(data_pipeline.input_data))
// console.log('output_data=', data_pipeline.output_data, typeof(data_pipeline.output_data))
// console.log(data_pipeline.flow.length)
// console.log(data_pipeline.flow[1].config, typeof(data_pipeline.flow[1].config))
console.log('test succesful');