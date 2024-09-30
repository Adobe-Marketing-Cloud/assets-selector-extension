const fetch = require('node-fetch');
const { Core } = require('@adobe/aio-sdk');
const { errorResponse, checkMissingRequestInputs } = require('../utils');

// Constants for field names
const KEYWORDS_FIELD_1 = "property=metadata.application.xcm:keywords.id";
const KEYWORDS_FIELD_2 = "property=xcm:keywords.id=";

// Sample configuration object, define asset configuration parameters
const AS_CONFIG = {
  "useProdDomain": true,
  "copyMode": [
    {
      "mimeType": "image/*",
      "value": "use-alt-text"
    }
  ],
  "blockName": [
    {
      "mimeType": "video/*",
      "value": "Video"
    }
  ],
  "blockTemplate": [
    {
      "mimeType": "video/*",
      "value": "<table border='1' style=\"width:100%\">\n  <tr>\n        <td style=\"background-color:#f5680a;color:#fff\">${blockName}</td>\n      </tr>\n      <tr>\n        <td>\n        <img src=\"${posterUrl}\" alt=\"${name}\">\n        <br/>\n        <a href=\"${videoUrl}\">${name}</a>\n        </td>\n      </tr>   </table>"
    }
  ],
  "filterSchema": [
    {
      "header": "File Types",
      "groupKey": "TopGroup",
      "fields": [
        {
          "defaultValue": [
            "image/*"
          ],
          "element": "checkbox",
          "name": "type",
          "options": [
            {
              "label": "Images",
              "value": "image/*"
            },
            {
              "label": "Videos",
              "value": "video/*"
            },
            {
              "label": "Documents",
              "value": "application/pdf"
            },
            {
              "label": "Archives",
              "value": "application/zip"
            }
          ],
          "columns": 2
        }
      ]
    },
    {
      "header": "Assets Tags",
      "groupKey": "AssetTagsGroup",
      "fields": [
        {
          "element": "taggroup",
          "name": "property=metadata.application.xcm:keywords.id",
          "columns": 3
        }
      ]
    },
    {
      "header": "Asset Status",
      "groupKey": "AssetStatusGroup",
      "fields": [
        {
          "element": "checkbox",
          "name": "status",
          "options": [
            {
              "label": "Active",
              "value": "active"
            },
            {
              "label": "Inactive",
              "value": "inactive"
            }
          ],
          "orientation": "horizontal",
          "columns": 2
        }
      ]
    },
    {
      "fields": [
        {
          "element": "checkbox",
          "name": "expiredAsset",
          "options": [
            {
              "label": "Expired",
              "value": "expired"
            }
          ],
          "orientation": "horizontal",
          "columns": 2
        },
        {
          "element": "DateRange",
          "name": "property=pur:expirationDate",
          "position": "top",
          "label": "Expiration Duration",
          "orientation": "horizontal"
        }
      ],
      "header": "Expiration Status",
      "groupKey": "ExpirationGroup"
    },
    {
      "fields": [
        {
          "element": "drop-down",
          "name": "property=metadata.embedded.dc:language",
          "orientation": "vertical",
          "options": [
            {
              "label": "Albanian (Albania)",
              "value": "sq_al"
            },
            {
              "label": "Arabic (Tunisia)",
              "value": "ar_tn"
            },
            {
              "label": "Arabic (Yemen)",
              "value": "ar_ye"
            },
            {
              "label": "Belorussian (Belorussia)",
              "value": "be_by"
            },
            {
              "label": "Bulgarian (Bulgaria)",
              "value": "bg_bg"
            },
            {
              "label": "Catalan (Spain)",
              "value": "ca_es"
            },
            {
              "label": "Chinese (Hong Kong SAR of China)",
              "value": "zh_hk"
            },
            {
              "label": "Chinese (Simplified)",
              "value": "zh"
            },
            {
              "label": "Chinese (Taiwan region)",
              "value": "zh_tw"
            },
            {
              "label": "Croatian (Croatia)",
              "value": "hr_hr"
            },
            {
              "label": "Czech (Czech Republic)",
              "value": "cs_cz"
            },
            {
              "label": "Danish (Denmark)",
              "value": "da_dk"
            },
            {
              "label": "Dutch (Belgium)",
              "value": "nl_be"
            },
            {
              "label": "Dutch (Netherlands)",
              "value": "nl_nl"
            },
            {
              "label": "English",
              "value": "en"
            },
            {
              "label": "English (Australia)",
              "value": "en_au"
            },
            {
              "label": "English (Canada)",
              "value": "en_ca"
            },
            {
              "label": "English (India)",
              "value": "en_in"
            },
            {
              "label": "English (Ireland)",
              "value": "en_ie"
            },
            {
              "label": "English (New Zealand)",
              "value": "en_nz"
            },
            {
              "label": "English (South Africa)",
              "value": "en_za"
            },
            {
              "label": "English (United Kingdom)",
              "value": "en_gb"
            },
            {
              "label": "English (United States)",
              "value": "en_us"
            },
            {
              "label": "Estonian (Estonia)",
              "value": "et_ee"
            },
            {
              "label": "Finnish (Finland)",
              "value": "fi_fi"
            },
            {
              "label": "French",
              "value": "fr"
            },
            {
              "label": "French (Belgium)",
              "value": "fr_be"
            },
            {
              "label": "French (Canada)",
              "value": "fr_ca"
            },
            {
              "label": "French (France)",
              "value": "fr_fr"
            },
            {
              "label": "French (Luxembourg)",
              "value": "fr_lu"
            },
            {
              "label": "French (Switzerland)",
              "value": "fr_ch"
            },
            {
              "label": "German",
              "value": "de"
            },
            {
              "label": "German (Austria)",
              "value": "de_at"
            },
            {
              "label": "German (Germany)",
              "value": "de_de"
            },
            {
              "label": "German (Luxembourg)",
              "value": "de_lu"
            },
            {
              "label": "German (Switzerland)",
              "value": "de_ch"
            },
            {
              "label": "Greek (Greece)",
              "value": "el_gr"
            },
            {
              "label": "Hebrew (Israel)",
              "value": "iw_il"
            },
            {
              "label": "Hindi (India)",
              "value": "hi_in"
            },
            {
              "label": "Hungarian (Hungary)",
              "value": "hu_hu"
            },
            {
              "label": "Icelandic (Iceland)",
              "value": "is_is"
            },
            {
              "label": "Italian",
              "value": "it"
            },
            {
              "label": "Italian (Italy)",
              "value": "it_it"
            },
            {
              "label": "Italian (Switzerland)",
              "value": "it_ch"
            },
            {
              "label": "Japanese",
              "value": "ja"
            },
            {
              "label": "Japanese (Japan)",
              "value": "ja_jp"
            },
            {
              "label": "Korean (South Korea)",
              "value": "ko_kr"
            },
            {
              "label": "Latvian (Latvia)",
              "value": "lv_lv"
            },
            {
              "label": "Lithuanian (Lithuania)",
              "value": "lt_lt"
            },
            {
              "label": "Macedonian (Macedonia)",
              "value": "mk_mk"
            },
            {
              "label": "Norwegian (Bokmål) (Norway)",
              "value": "no_no"
            },
            {
              "label": "Norwegian (Nynorsk) (Norway)",
              "value": "no_no_ny"
            },
            {
              "label": "Polish (Poland)",
              "value": "pl_pl"
            },
            {
              "label": "Portuguese",
              "value": "pt"
            },
            {
              "label": "Portuguese (Brazil)",
              "value": "pt_br"
            },
            {
              "label": "Portuguese (Portugal)",
              "value": "pt_pt"
            },
            {
              "label": "Romanian (Romania)",
              "value": "ro_ro"
            },
            {
              "label": "Russian",
              "value": "ru"
            },
            {
              "label": "Russian (Russia)",
              "value": "ru_ru"
            },
            {
              "label": "Serbian (Cyrillic) (Yugoslavia)",
              "value": "sr_yu"
            },
            {
              "label": "Serbo-Croatian (Yugoslavia)",
              "value": "sh_yu"
            },
            {
              "label": "Simplified Chinese (China)",
              "value": "zh_cn"
            },
            {
              "label": "Slovak (Slovakia)",
              "value": "sk_sk"
            },
            {
              "label": "Slovenian (Slovenia)",
              "value": "sl_si"
            },
            {
              "label": "Spanish",
              "value": "es"
            },
            {
              "label": "Spanish (Argentina)",
              "value": "es_ar"
            },
            {
              "label": "Spanish (Bolivia)",
              "value": "es_bo"
            },
            {
              "label": "Spanish (Chile)",
              "value": "es_cl"
            },
            {
              "label": "Spanish (Colombia)",
              "value": "es_co"
            },
            {
              "label": "Spanish (Costa Rica)",
              "value": "es_cr"
            },
            {
              "label": "Spanish (Dominican Republic)",
              "value": "es_do"
            },
            {
              "label": "Spanish (Ecuador)",
              "value": "es_ec"
            },
            {
              "label": "Spanish (El Salvador)",
              "value": "es_sv"
            },
            {
              "label": "Spanish (Guatemala)",
              "value": "es_gt"
            },
            {
              "label": "Spanish (Honduras)",
              "value": "es_hn"
            },
            {
              "label": "Spanish (Mexico)",
              "value": "es_mx"
            },
            {
              "label": "Spanish (Nicaragua)",
              "value": "es_ni"
            },
            {
              "label": "Spanish (Panama)",
              "value": "es_pa"
            },
            {
              "label": "Spanish (Paraguay)",
              "value": "es_py"
            },
            {
              "label": "Spanish (Peru)",
              "value": "es_pe"
            },
            {
              "label": "Spanish (Puerto Rico)",
              "value": "es_pr"
            },
            {
              "label": "Spanish (Spain)",
              "value": "es_es"
            },
            {
              "label": "Spanish (Uruguay)",
              "value": "es_uy"
            },
            {
              "label": "Spanish (Venezuela)",
              "value": "es_ve"
            },
            {
              "label": "Swedish",
              "value": "sv"
            },
            {
              "label": "Swedish (Sweden)",
              "value": "sv_se"
            },
            {
              "label": "Thai (Thai digits) (Thailand)",
              "value": "th_th_th"
            },
            {
              "label": "Thai (Western digits) (Thailand)",
              "value": "th_th"
            },
            {
              "label": "Turkish (Turkey)",
              "value": "tr_tr"
            },
            {
              "label": "Ukrainian (Ukraine)",
              "value": "uk_ua"
            }
          ]
        }
      ],
      "header": "Language",
      "groupKey": "LanguageGroup"
    }
  ],
  "hideFilters": "true"
};

// Utility function to check if a given text matches a regex pattern (case-insensitive)
function matchesPattern(pattern, text) {
  const regex = new RegExp(pattern, 'i');
  return regex.test(text);
}

// Function to find matching tags from the API response based on the webPath
function findMatchingTags(webPath, json, logger) {
  logger.info(`Finding matching tags for path: ${webPath}`);
  return json.data.filter(item => matchesPattern(item.pattern, webPath));
}

// Inject matching tags into AS_CONFIG for further processing
function injectDefaultTags(tags) {
  AS_CONFIG.filterSchema?.forEach(schema => {
    if (schema.groupKey === 'AssetTagsGroup') {
      schema.fields?.forEach(field => {
        if ([KEYWORDS_FIELD_1, KEYWORDS_FIELD_2].includes(field.name)) {
          field.defaultValue = tags.map(tag => tag.id);
          field.options = tags.map(tag => ({
            label: tag.name,
            value: tag.id
          }));
        }
      });
    }
  });
}

// Main function to handle the asset tag injection
async function main(params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' });

  try {
    logger.info('Processing asset tag injection');
    logger.debug(JSON.stringify(params, null, 2));

    // Validate required parameters
    const requiredParams = [];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, []);
    if (errorMessage) {
      return errorResponse(400, errorMessage, logger);
    }

    // Context details API endpoint to fetch asset tags
    const contextEndpoint = params.contextEndpoint || 'https://assets-addon.adobeaemcloud.com/tags.json';

    // Fetching tags data from the API
    const res = await fetch(contextEndpoint);
    if (!res.ok) {
      throw new Error(`Failed to fetch from ${contextEndpoint}, Status Code: ${res.status}`);
    }

    const content = await res.json();
    logger.info(`Fetched content from ${contextEndpoint}`);

    // Process and inject matching tags based on webPath
    const matchingTags = findMatchingTags(params.webPath, content, logger);
    injectDefaultTags(matchingTags);

    return {
      statusCode: 200,
      body: AS_CONFIG
    };
  } catch (error) {
    logger.error(error);
    return errorResponse(500, 'Server error occurred', logger);
  }
}

exports.main = main;
