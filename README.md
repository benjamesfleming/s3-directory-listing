# S3 Directory Listing

List files and folders in a [AWS S3](https://aws.amazon.com/s3) bucket.

View a live demo at [**https://dl.benfleming.nz**](https://dl.benfleming.nz).

### Installation

To install this program, simply copy the latest version of the `dist/index.html` file to the *root* of your bucket with the correct `Region` & `Bucket` config values. And set your S3 bucket to be served as a static website.

1. Download `dist/index.html`
2. Configure the `index.html` file
	1. Set the bucket `Region` 
	2. Set the bucket `Bucket` name
3. Set S3 bucket policy to allow public listing
4. Set S3 bucket as static website
5. View your buckets contents at the URL generated by AWS on the *static website* tab.

**Raw HTML Link**

```text
https://raw.githubusercontent.com/benjamesfleming/s3-directory-listing/master/dist/index.html
```

**Example Config**

```html
<script type="text/javascript">
	const CONFIG = {
		Region      : 'ap-southeast-2',      // SET THE S3 BUCKET REGION
		Bucket      : 'dl.benfleming.nz',    // SET THE S3 BUCKET NAME
		DateFormat  : 'MMM Do YYYY hh:mm:ss a ZZ'
	};
</script>
```

**AWS S3 Bucket Policy**

Copy the policy below into the **`Bucket > Permissions > Bucket Policy`** page in the [AWS Console](https://console.aws.amazon.com/)

```json
{
	"Version": "2012-10-17",
	"Id": "PolicyS3PublicAccess",
	"Statement": [
		{
			"Effect": "Allow",
			"Principal": "*",
			"Action": [
				"s3:GetObject",
				"s3:ListBucket"
			],
			"Resource": [
				"arn:aws:s3:::<your-bucket-name-here>",
				"arn:aws:s3:::<your-bucket-name-here>/*"
			]
		}
	]
}
```


### License

MIT License

Copyright (c) 2019 Ben Fleming

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.