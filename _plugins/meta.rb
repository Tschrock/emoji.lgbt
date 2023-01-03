module DocumentOverrides
    def read_content(**opts)
        super
        meta_file = (path + ".yml")
        if File.exist?(meta_file)
            meta_data = SafeYAML.load_file(meta_file)
            merge_data!(meta_data, :source => "YAML sidecar")
        end
    end
end

Jekyll::Document.prepend DocumentOverrides

module UtilsOverrides
    def has_yaml_header?(file)
        File.exist?(file + ".yml") || super
    end
end

Jekyll::Utils.singleton_class.prepend UtilsOverrides
