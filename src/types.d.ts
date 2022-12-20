import { SecretUtil } from "./secretmanagerutil";

declare namespace jam {
    type SecretUtilOptions = {
        /**
         * Path to SA json key
         */
        keyFile?: string | undefined;
        /**
         * GCP project ID
         */
        projectId?: string | undefined;
    };
}
export default jam;
