# Adobe Assets Selector Extension Configuration

This repository contains a sample configuration that is hosted by the **App Builder** platform to extend the **Assets Selector**. The end point returns the configs as per the schema specified here at [Assets Selector extensions](https://www.aem.live/docs/aem-assets-sidekick-plugin#customizing-the-aem-assets-sidekick-plugin). Configuration can be generated on-the-fly based on the context provided, to enforce various filtering at the time of Assets Selector initialization. The configuration can be context-aware or context-agnostic depending on the provided parameters.

## Overview

The hosted configuration serves as an example of how to host an extension config to extend the functionality of the Assets Selector. It enables dynamic generation of configurations, which can be customized based on the Web Page's path.

### Key Features:
- **Dynamic Configuration**: Generate configuration at runtime based on the web path provided.
- **Contextual Extensions**: Match specific tags based on the web path or URL pattern and apply them as default tags to extend the Assets Selector functionality.
- **Context-Agnostic**: The config can also work without any web path, providing a generic set of configurations.

## Parameters

The following parameters are accepted by the extension configuration:

### 1. `webPath` (optional)
- **Description**: This is the path of the web page for which the configuration is invoked. For a detailed explanation, refer to the [Adobe Experience Manager (AEM) documentation](https://www.aem.live/developer/configuring-aem-assets-sidekick-plugin#note-contextual-configuration-based-on-page-being-authored).
- **Usage**: Assets Selector can generate an extension config in the context of a specific web page. For example the tags of `webPath` can be used to set the context (from the `contextDetails` endpoint) and apply to the configuration.
- **Example**: `/content/mywebsite/homepage`

### 2. `contextEndpoint` (optional)
- **Description**: An API endpoint that provides a JSON containing URL or path patterns mapped to specific context. The configuration will compare the `webPath` parameter against these patterns to find matching context, which will then be used to generate the configuration.
- **Usage**: This endpoint should return a JSON with a structure similar to:
  ```json
  {
    "data": [
      {
        "pattern": "/content/mywebsite/.*",
        "tags": [
          { "id": "tag1", "name": "Marketing" },
          { "id": "tag2", "name": "Homepage" }
        ]
      }
    ]
  }
  ```
- **Example**: `https://assets-addon.adobeaemcloud.com/tags.json`

### 3. `LOG_LEVEL` (optional)
- **Description**: The log verbosity level for debugging. Possible values include `info`, `debug`, `warn`, `error`.
- **Usage**: Useful for troubleshooting the behavior of the configuration, especially when debugging the dynamic tag generation.

## Sample Requests

Here’s an example of how to invoke the hosted configuration with all parameters:

```html
https://245265-extensionconfig-stage.adobeioruntime.net/api/v1/web/extension-config/extension-config
```

```html
https://245265-extensionconfig-stage.adobeioruntime.net/api/v1/web/extension-config/extension-config?webPath=snorkling
```

```html
https://245265-extensionconfig-stage.adobeioruntime.net/api/v1/web/extension-config/extension-config?webPath=snorkling&contextEndpoint=https://assets-addon.adobeaemcloud.com/tags.json
```

### Response Example

The response will dynamically generate a configuration based on the matching tags from the provided `contextEndpoint` and the given `webPath`:

```json
{
  "useProdDomain": true,
  "copyMode": [
    {
      "mimeType": "image/*",
      "value": "use-alt-text"
    }
  ],
  "filterSchema": [
    {
      "header": true,
      "groupKey": "AssetTagsGroup",
      "fields": [
        {
          "name": "property=metadata.application.xcm:keywords.id",
          "defaultValue": ["tag1", "tag2"],
          "options": [
            { "label": "Marketing", "value": "tag1" },
            { "label": "Homepage", "value": "tag2" }
          ]
        }
      ]
    }
  ]
}
```

## How It Works

- **Without `webPath`**: When no `webPath` is provided, the configuration will return a generic set of options defined in the config.
- **With `webPath`**: If the `webPath` is provided, the app consider a context of the web page and applies to generate the configuration.
