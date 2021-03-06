package com.blocklang.develop.data;

import javax.validation.constraints.NotBlank;

import com.blocklang.develop.constant.AppType;

public class CheckPageKeyParam {

	@NotBlank(message = "{NotBlank.pageKey}")
	private String key;
	private Integer parentId;
	private String appType;

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}

	public AppType getAppType() {
		return AppType.fromKey(appType);
	}

	public void setAppType(String appType) {
		this.appType = appType;
	}

}
